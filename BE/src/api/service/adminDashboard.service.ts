import User from "../models/user.model";
import JobListingModel from "../models/jobListing.model";
import { PaymentModel } from "../models/payment.model";
import SubscriptionModel from "../models/subscription.model";
import { JobApprovalStatus } from "../models/enum/jobListingStatus.enum";

export const getAdminDashboardStatsService = async () => {
  const now = new Date();
  
  // Start and end of current month
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Start and end of previous month
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  // 1. Total users
  const totalUsers = await User.countDocuments({ isDeleted: false });

  // 2. Job Seekers
  const totalJobSeekers = await User.countDocuments({ role: "job_seeker", isDeleted: false });

  // 3. Recruiters
  const totalRecruiters = await User.countDocuments({ role: "recruiter", isDeleted: false });

  // 4. Monthly revenue (current month)
  const revenueResult = await PaymentModel.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // 5. Pending posts
  const pendingPosts = await JobListingModel.countDocuments({
    approvalStatus: JobApprovalStatus.PENDING,
    isDeleted: false
  });

  // 6. Approved posts
  const approvedPosts = await JobListingModel.countDocuments({
    approvalStatus: JobApprovalStatus.APPROVED,
    isDeleted: false
  });

  // 7. Active Packages (active subscriptions)
  const activePackages = await SubscriptionModel.countDocuments({ status: "active" });

  // 8. User growth (current month vs previous month)
  const currentMonthUsersCount = await User.countDocuments({
    createdAt: { $gte: startOfCurrentMonth },
    isDeleted: false
  });
  const previousMonthUsersCount = await User.countDocuments({
    createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    isDeleted: false
  });

  const monthlyGrowth = previousMonthUsersCount > 0
    ? parseFloat((((currentMonthUsersCount - previousMonthUsersCount) / previousMonthUsersCount) * 100).toFixed(1))
    : currentMonthUsersCount > 0 ? 100 : 0;

  // 9. Recent 5 job posts
  const rawRecentPosts = await JobListingModel.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("companyId", "name")
    .populate("locationId", "location.city")
    .populate("recruiterId", "firstName lastName");

  const recentJobPosts = rawRecentPosts.map((post: any) => ({
    id: post._id,
    title: post.title,
    company: post.companyId?.name || "Unknown Company",
    location: post.locationId?.location?.city || "N/A",
    recruiterName: post.recruiterId ? `${post.recruiterId.firstName} ${post.recruiterId.lastName}` : "Unknown Recruiter",
    status: post.approvalStatus || "pending"
  }));

  return {
    totalUsers,
    totalJobSeekers,
    totalRecruiters,
    totalRevenue,
    pendingPosts,
    approvedPosts,
    activePackages,
    monthlyGrowth,
    recentPosts: recentJobPosts
  };
};

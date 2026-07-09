import { Users, UserCheck, Package, FileText, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/layouts/admin/StatsCard';
import { useGetAdminDashboardStatsQuery } from '@/features/admin/api/admin.service';

export default function AdminDashboard() {
  const { data: response, isLoading, error } = useGetAdminDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-500 font-medium">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error || !response?.success) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center text-red-500 font-medium">
        Không thể tải dữ liệu thống kê. Vui lòng thử lại sau!
      </div>
    );
  }

  const stats = response.data;
  const recentPosts = stats.recentPosts || [];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          change={`+${stats.monthlyGrowth}% so với tháng trước`}
          changeType={stats.monthlyGrowth >= 0 ? "positive" : "negative"}
          icon={Users}
        />
        <StatsCard
          title="Job Seekers"
          value={stats.totalJobSeekers}
          change="Đang hoạt động"
          changeType="neutral"
          icon={UserCheck}
        />
        <StatsCard
          title="Recruiters"
          value={stats.totalRecruiters}
          change="Đang hoạt động"
          changeType="neutral"
          icon={Users}
        />
        <StatsCard
          title="Doanh thu tháng"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ`}
          change="Tháng này"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Bài đăng chờ duyệt"
          value={stats.pendingPosts}
          change="Cần xử lý"
          changeType={stats.pendingPosts > 0 ? "negative" : "neutral"}
          icon={FileText}
        />
        <StatsCard
          title="Bài đăng đã duyệt"
          value={stats.approvedPosts}
          change="Tất cả bài viết"
          changeType="positive"
          icon={FileText}
        />
        <StatsCard
          title="Gói đang hoạt động"
          value={stats.activePackages}
          change="Tất cả gói"
          changeType="neutral"
          icon={Package}
        />
        <StatsCard
          title="Tăng trưởng"
          value={`${stats.monthlyGrowth}%`}
          change="Người dùng mới"
          changeType={stats.monthlyGrowth >= 0 ? "positive" : "negative"}
          icon={TrendingUp}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Bài đăng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                Không có bài đăng nào gần đây.
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{post.title}</h4>
                      <p className="text-xs text-gray-500">{post.company} • {post.location}</p>
                      <p className="text-xs text-gray-400">Bởi {post.recruiterName}</p>
                    </div>
                    <Badge 
                      variant={
                        post.status === 'approved' ? 'default' : 
                        post.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                      className={
                        post.status === 'approved' ? 'bg-green-100 text-green-800' :
                        post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {post.status === 'approved' ? 'Đã duyệt' : 
                       post.status === 'pending' ? 'Chờ duyệt' : 
                       'Từ chối'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900">Bài đăng chờ duyệt</h4>
                <p className="text-sm text-orange-700 mt-1">
                  {stats.pendingPosts} bài đăng đang chờ được duyệt
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900">Người dùng hệ thống</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Gồm {stats.totalJobSeekers} Job Seekers và {stats.totalRecruiters} Recruiters
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900">Gói hoạt động</h4>
                <p className="text-sm text-green-700 mt-1">
                  Có {stats.activePackages} gói đăng ký đang có hiệu lực
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { Request, Response } from "express";
import { getAdminDashboardStatsService } from "../service/adminDashboard.service";

export const handleGetAdminDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await getAdminDashboardStatsService();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Error getting admin dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

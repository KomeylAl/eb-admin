"use client";

import { useState } from "react";
import KPICard from "./_components/KPICard";
import RevenueChart from "./_components/RevenueChart";
import ServiceRevenueChart from "./_components/ServiceRevenueChart";
import DataTable from "./_components/DataTable";
import StatusBadge from "./_components/StatusBadge";
import {
  DollarSign,
  CreditCard,
  Clock,
  RotateCcw,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { format, subDays, startOfMonth, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountingHeader from "./_components/AccountingHeader";
import Link from "next/link";
import { useAppointments } from "@/hooks/useAppointments";
import { usePayments } from "@/hooks/usePayments";

export default function AccountingDashboard() {
  const [period, setPeriod] = useState("monthly");

  const { data: payments, isLoading: loadingPayments } = usePayments(
    1,
    1000,
    "",
    ""
  );

  const { data: appointments, isLoading: loadingAppointments } =
    useAppointments(1, 10, "", "");

  // Calculate KPIs
  const calculateKPIs = () => {
    const now = new Date();
    let startDate;

    if (period === "daily") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === "weekly") {
      startDate = subDays(now, 7);
    } else {
      startDate = startOfMonth(now);
    }

    const filteredPayments =
      payments &&
      payments.data.filter((p: any) => {
        const paymentDate = new Date(p.transaction_date || p.created_date);
        return paymentDate >= startDate;
      });

    const totalRevenue =
      filteredPayments &&
      filteredPayments.reduce(
        (sum: number, p: any) => sum + (p.final_amount || 0),
        0
      );
    const paidAmount =
      filteredPayments &&
      filteredPayments
        .filter((p: any) => p.status === "paid")
        .reduce((sum: number, p: any) => sum + (p.final_amount || 0), 0);
    const unpaidAmount =
      filteredPayments &&
      filteredPayments
        .filter((p: any) => p.status === "unpaid")
        .reduce((sum: number, p: any) => sum + (p.final_amount || 0), 0);
    const pendingAmount =
      filteredPayments &&
      filteredPayments
        .filter((p: any) => p.status === "partial")
        .reduce(
          (sum: number, p: any) =>
            sum + ((p.final_amount || 0) - (p.paid_amount || 0)),
          0
        );
    const refundedAmount =
      filteredPayments &&
      filteredPayments
        .filter((p: any) => p.status === "refunded")
        .reduce((sum: number, p: any) => sum + (p.final_amount || 0), 0);

    return {
      totalRevenue,
      paidAmount,
      unpaidAmount,
      pendingAmount,
      refundedAmount,
    };
  };

  const kpis = calculateKPIs();

  // Generate chart data
  const generateChartData = () => {
    const now = new Date();
    const days = eachDayOfInterval({ start: subDays(now, 30), end: now });

    return days.map((day) => {
      const dayPayments = payments && payments.data.filter((p: any) => {
        const paymentDate = new Date(p.transaction_date || p.created_at);
        return format(paymentDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      });

      return {
        name: format(day, "MMM d"),
        revenue: dayPayments && dayPayments.reduce(
          (sum: number, p: any) => sum + (p.final_amount || 0),
          0
        ),
      };
    });
  };

  // Revenue by service
  const getServiceRevenue = () => {
    const serviceMap = {};
    payments && payments.data.forEach((p: any) => {
      const service = p.service || "Other";
      serviceMap[service] = (serviceMap[service] || 0) + (p.final_amount || 0);
    });

    return Object.entries(serviceMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 6);
  };

  // Revenue by doctor
  const getDoctorRevenue = () => {
    const doctorMap = {};
    payments && payments.data.forEach((p: any) => {
      const doctor = p.doctor_name || "Unassigned";
      doctorMap[doctor] = (doctorMap[doctor] || 0) + (p.final_amount || 0);
    });

    return Object.entries(doctorMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 6);
  };

  // Recent payments
  const recentPayments = payments && payments.data.slice(0, 5);

  const paymentColumns = [
    {
      header: "Patient",
      accessor: "patient_name",
      render: (row: any) => (
        <div>
          <p className="font-medium text-slate-900">{row.patient_name}</p>
          <p className="text-xs text-slate-500">{row.service}</p>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "transaction_date",
      render: (row: any) => (
        <span className="text-slate-600">
          {row.transaction_date
            ? format(new Date(row.transaction_date), "MMM d, yyyy")
            : "-"}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: "final_amount",
      render: (row: any) => (
        <span className="font-semibold text-slate-900">
          $
          {(row.final_amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row: any) => <StatusBadge status={row.status} />,
    },
  ];

  const isLoading = loadingPayments || loadingAppointments;

  return (
    <div className="mr-64">
      <AccountingHeader title="" subtitle="" />
      <div className="flex items-center justify-between mb-8">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="daily" className="data-[state=active]:bg-white">
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-white"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-white"
            >
              Monthly
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Link href={"FinancialReports"}>
          <Button variant="outline" className="border-slate-200">
            <TrendingUp className="w-4 h-4 ml-2" />
            View Reports
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Revenue"
          value={kpis.totalRevenue}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Paid Amount"
          value={kpis.paidAmount}
          change="+8.2%"
          changeType="positive"
          icon={CreditCard}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Pending Payments"
          value={kpis.pendingAmount + kpis.unpaidAmount}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <KPICard
          title="Refunded"
          value={kpis.refundedAmount}
          icon={RotateCcw}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={generateChartData()} isLoading={isLoading} />
        <ServiceRevenueChart
          data={getServiceRevenue()}
          isLoading={isLoading}
          title="Revenue by Service"
        />
      </div>

      {/* Doctor Revenue & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServiceRevenueChart
          data={getDoctorRevenue()}
          isLoading={isLoading}
          title="Revenue by Doctor"
        />

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Payments
            </h3>
            <Link href={"Payments"}>
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-600 hover:text-emerald-700"
              >
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <DataTable
            columns={paymentColumns}
            data={recentPayments}
            isLoading={isLoading}
            emptyMessage="No recent payments"
            className="border-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}

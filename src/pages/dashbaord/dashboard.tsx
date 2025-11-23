import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Users,
  Layers,
  ArrowUpRight,
  SplineIcon,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";

type Employee = {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};
type Team = {
  id: string;
  name: string;
  members?: any[];
  member_count?: number;
};

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [eRes, tRes] = await Promise.all([
          api.get("/employees"),
          api.get("/teams"),
        ]);
        if (!mounted) return;
        setEmployees(eRes.data?.data || []);
        setTeams(tRes.data?.data || []);
      } catch (err: any) {
        if (mounted) {
          const errorMsg =
            err?.response?.data?.message || "Failed to load dashboard data";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchTeamMembersIfNeeded = async (team: Team) => {
    if (team.member_count !== undefined) return team.member_count;
    if (Array.isArray(team.members)) return team.members.length;
    try {
      const res = await api.get(`/teams/${team.id}/members`);
      return (res.data?.data || []).length;
    } catch (err) {
      return 0;
    }
  };

  const [teamSizes, setTeamSizes] = useState<
    { id: string; name: string; count: number }[]
  >([]);

  useEffect(() => {
    if (!teams.length) {
      setTeamSizes([]);
      return;
    }

    let mounted = true;
    const loadSizes = async () => {
      setLoadingMembers(true);
      try {
        const promises = teams.map(async (t) => {
          const cnt = await fetchTeamMembersIfNeeded(t);
          return { id: t.id, name: t.name || "Unnamed", count: cnt };
        });

        const results = await Promise.all(promises);
        if (!mounted) return;
        setTeamSizes(results);
      } catch (err) {
        console.error("Failed to fetch all team sizes:", err);
      } finally {
        if (mounted) setLoadingMembers(false);
      }
    };

    loadSizes();
    return () => {
      mounted = false;
    };
  }, [teams]);

  const totalEmployees = employees.length;
  const totalTeams = teams.length;
  const totalAssigned = teamSizes.reduce((s, t) => s + t.count, 0);

  const teamChartData = useMemo(
    () => teamSizes.map((t) => ({ name: t.name, size: t.count })),
    [teamSizes]
  );

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="flex flex-col items-center">
          <SplineIcon className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-700">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
          Data Load Error
        </h3>
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
        <Button onClick={refreshData} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Comprehensive overview of employees and organizational structure.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              window.location.href = "/employees";
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <hr className="my-6" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-chart-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Employees
            </h3>
            <Users className="h-5 w-5 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground pt-1">
              All users in the system
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-chart-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Teams
            </h3>
            <Layers className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTeams}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Organizational departments
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-chart-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Assigned Employees
            </h3>
            <ArrowUpRight className="h-5 w-5 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAssigned}</div>
            <p className="text-xs text-muted-foreground pt-1">
              {loadingMembers
                ? "Calculating member counts..."
                : "Live member data"}
            </p>
          </CardContent>
        </Card>
      </div>

      <hr className="my-6" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Team Size Distribution</CardTitle>
          </CardHeader>

          <CardContent className="h-[350px] p-4 pt-0">
            {teamChartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teamChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="grey" />
                  <XAxis
                    dataKey="name"
                    stroke="grey"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="grey"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "grey",
                      borderColor: "grey",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="size" fill="skyblue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  No team data available for charting.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Top 10 Teams by Size</CardTitle>
          <p className="text-sm text-muted-foreground">
            A sortable list of the biggest teams.
          </p>
        </CardHeader>

        <CardContent>
          {teamSizes.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="w-[100px] text-center">
                      Rank
                    </TableHead>
                    <TableHead className="text-center">Team</TableHead>
                    <TableHead className="text-center">Members</TableHead>
                    <TableHead className="text-right w-[80px] text-center">
                      View
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {[...teamSizes]
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10)
                    .map((t, index) => (
                      <TableRow key={t.id} className={index === 0 ? "" : ""}>
                        <TableCell className="font-medium text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {t.name}
                        </TableCell>
                        <TableCell className="text-center">{t.count}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              window.location.href = `/teams`;
                            }}
                          >
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No teams to show.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

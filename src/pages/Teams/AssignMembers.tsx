import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Users,
  ArrowUpDown,
} from "lucide-react";

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position?: string;
};

type Props = {
  teamId: string;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export default function AssignMembersDialog({
  teamId,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [members, setMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "assigned" | "unassigned"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "email" | "position">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [assigningIds, setAssigningIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setSearch("");
      setStatusFilter("all");
      return;
    }

    setLoading(true);
    Promise.all([api.get("/employees"), api.get(`/teams/${teamId}/members`)])
      .then(([empsRes, membersRes]) => {
        setAllEmployees(empsRes.data.data || []);
        setMembers(membersRes.data.data || []);
      })
      .catch(() => {
        toast.error("Failed to load employees");
      })
      .finally(() => setLoading(false));
  }, [teamId, open]);

  const isMember = (id: string) => members.some((m) => m.id === id);

  const assign = async (employee_id: string) => {
    setAssigningIds((prev) => new Set(prev).add(employee_id));
    try {
      await api.post("/teams/assign", { employee_id, team_id: teamId });
      toast.success("Employee assigned successfully");
      const employee = allEmployees.find((e) => e.id === employee_id);
      if (employee) {
        setMembers((m) => [...m, employee]);
      }
      onUpdated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to assign employee");
    } finally {
      setAssigningIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(employee_id);
        return newSet;
      });
    }
  };

  const unassign = async (employee_id: string) => {
    setAssigningIds((prev) => new Set(prev).add(employee_id));
    try {
      await api.post("/teams/unassign", { employee_id, team_id: teamId });
      toast.success("Employee unassigned successfully");
      setMembers((m) => m.filter((x) => x.id !== employee_id));
      onUpdated();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to unassign employee"
      );
    } finally {
      setAssigningIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(employee_id);
        return newSet;
      });
    }
  };

  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = allEmployees;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          `${e.first_name} ${e.last_name}`
            .toLowerCase()
            .includes(searchLower) ||
          e.email.toLowerCase().includes(searchLower) ||
          (e.position && e.position.toLowerCase().includes(searchLower))
      );
    }

    if (statusFilter === "assigned") {
      filtered = filtered.filter((e) => isMember(e.id));
    } else if (statusFilter === "unassigned") {
      filtered = filtered.filter((e) => !isMember(e.id));
    }

    const sorted = [...filtered].sort((a, b) => {
      let aVal = "";
      let bVal = "";

      if (sortBy === "name") {
        aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
        bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else if (sortBy === "email") {
        aVal = a.email.toLowerCase();
        bVal = b.email.toLowerCase();
      } else if (sortBy === "position") {
        aVal = (a.position || "").toLowerCase();
        bVal = (b.position || "").toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });

    return sorted;
  }, [allEmployees, members, search, statusFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const assigned = allEmployees.filter((e) => isMember(e.id)).length;
    const unassigned = allEmployees.length - assigned;
    return { assigned, unassigned, total: allEmployees.length };
  }, [allEmployees, members]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48 mt-2" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-20 ml-auto" />
      </TableCell>
    </TableRow>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assign Team Members
          </DialogTitle>
          <DialogDescription>
            Add or remove employees from this team. Employees can be in multiple
            teams. Changes are saved immediately.
          </DialogDescription>
        </DialogHeader>

        {!loading && (
          <div className="flex items-center gap-2 py-2">
            <Badge variant="secondary" className="gap-1">
              <UserCheck className="h-3 w-3" />
              {stats.assigned} in team
            </Badge>
            <Badge variant="outline" className="gap-1">
              <UserX className="h-3 w-3" />
              {stats.unassigned} not in team
            </Badge>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start md:items-center gap-3 pb-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, or position..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v: any) => setStatusFilter(v)}
            disabled={loading}
          >
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="assigned">In this team</SelectItem>
              <SelectItem value="unassigned">Not in this team</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(v: any) => setSortBy(v)}
            disabled={loading}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="position">Position</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSort}
            disabled={loading}
            title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto border rounded-md">
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </TableBody>
            </Table>
          ) : filteredAndSortedEmployees.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No employees found</h3>
              <p className="text-sm text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "No employees available in the system."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEmployees.map((e) => {
                  const isAssigned = isMember(e.id);
                  const isProcessing = assigningIds.has(e.id);

                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div className="font-medium">
                          {e.first_name} {e.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {e.email}
                        </div>
                        {e.position && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {e.position}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {isAssigned ? (
                          <Badge variant="default" className="gap-1">
                            <UserCheck className="h-3 w-3" />
                            In this team
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <UserX className="h-3 w-3" />
                            Not in this team
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isAssigned ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => unassign(e.id)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Removing..." : "Remove"}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => assign(e.id)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Adding..." : "Add"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {!loading && (
              <>
                Showing {filteredAndSortedEmployees.length} of {stats.total}{" "}
                employees
              </>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

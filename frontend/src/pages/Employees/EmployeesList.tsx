import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { EmployeeFormDialog } from "./EmployeeForm";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  MoreHorizontal,
  Plus,
  Users,
  Search,
  ArrowLeft,
  Edit,
  Delete,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EmployeesList() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<any | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /* ----------------------- FILTER LOGIC ----------------------- */
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        `${e.first_name} ${e.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.phone.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [employees, search]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/employees/${deleteTarget.id}`);
      toast.success("Employee deleted");
      setEmployees((s) => s.filter((e) => e.id !== deleteTarget.id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  /* ============================================================ */

  return (
    <>
      <div className="mb-3 p-4 md:p-2">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Employee Table
        </h1>
        <p className="text-muted-foreground">
          Manage and view Employees with advanced filtering and search.
        </p>
      </div>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 top-3/5 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search all fields..."
                className="w-full md:w-120 pl-10 border border-border bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          </div>
        </div>
      </CardHeader>
      <Card>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : employees.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No employees in the organization
              </h3>
              <p className="text-muted-foreground mb-6">
                Add your first employee to get started.
              </p>
              <Button
                onClick={() => {
                  setEditing(null);
                  setOpenForm(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </div>
          ) : search && filteredEmployees.length === 0 ? (
            <div className="py-10 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No employees matched
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms.
              </p>
              <Button variant="outline" onClick={() => setSearch("")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to table
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredEmployees.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      {e.first_name} {e.last_name}
                    </TableCell>
                    <TableCell>{e.email}</TableCell>
                    <TableCell>{e.phone}</TableCell>

                    <TableCell>
                      <Badge variant="default">{e.position}</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditing(e);
                              setOpenForm(true);
                            }}
                          >
                            Edit
                            <Edit className="h2 w-2 text-primary" />
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteTarget(e)}
                          >
                            Delete
                            <X className="h-2 w-2 text-destructive" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit */}
      <EmployeeFormDialog
        open={openForm}
        employee={editing}
        onClose={() => setOpenForm(false)}
        onSaved={(saved) => {
          setEmployees((prev) => {
            const idx = prev.findIndex((x) => x.id === saved.id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = saved;
              return copy;
            }
            return [saved, ...prev];
          });
        }}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this employee?
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

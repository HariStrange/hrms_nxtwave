import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { TeamFormDialog } from "./TeamForm";
import AssignMembersDialog from "./AssignMembers";

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
  UserPlus,
  Edit,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeamsList() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<any | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const [assigningTeamId, setAssigningTeamId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/teams");
      setTeams(res.data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /* ----------------------- FILTER LOGIC ----------------------- */
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [teams, search]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/teams/${deleteTarget.id}`);
      toast.success("Team deleted");
      setTeams((s) => s.filter((t) => t.id !== deleteTarget.id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  /* ============================================================ */

  return (
    <>
      <div className="mb-3 md:p-2">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Teams</h1>
        <p className="text-muted-foreground">
          Manage and view Teams with advanced search.
        </p>
      </div>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="relative flex-1  flex   ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search teams..."
                className="w-1/2 pl-10 border border-border bg-background"
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
              New Team
            </Button>
          </div>
        </div>
      </CardHeader>
      <Card>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : teams.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No teams in the organization
              </h3>
              <p className="text-muted-foreground mb-6">
                Add your first team to get started.
              </p>
              <Button
                onClick={() => {
                  setEditing(null);
                  setOpenForm(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Team
              </Button>
            </div>
          ) : search && filteredTeams.length === 0 ? (
            <div className="py-10 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No teams matched</h3>
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
                  <TableHead className="">Name</TableHead>
                  <TableHead className="text-center">Members</TableHead>
                  <TableHead className="text-center">Assign Members</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTeams.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell className="text-center">
                      {t.member_count ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAssigningTeamId(t.id)}
                      >
                        <Badge variant="default">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign Members
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="center">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditing(t);
                              setOpenForm(true);
                            }}
                          >
                            <Edit className="h-2 w-2 text-primary" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteTarget(t)}
                          >
                            <X className="h-2 w-2 text-destructive" />
                            Delete
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
      <TeamFormDialog
        open={openForm}
        team={editing}
        onClose={() => setOpenForm(false)}
        onSaved={(saved) => {
          setTeams((prev) => {
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

      {/* Assign Members */}
      <AssignMembersDialog
        teamId={assigningTeamId || ""}
        open={!!assigningTeamId}
        onClose={() => setAssigningTeamId(null)}
        onUpdated={load}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this team?
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

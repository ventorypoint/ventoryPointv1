"use client";

import { useState, useMemo } from "react";
import { Plus, Search, UserCircle, KeyRound, ShieldAlert, Link as LinkIcon, Copy, Check, X, Trash2, Shield, ShieldOff } from "lucide-react";
import { removeMember, toggleMemberStatus, generateInviteCode } from "../actions";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { TablePagination } from "@/components/ui/table-pagination";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Modal } from "@/components/ui/modal";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

type Member = {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  is_active: boolean;
  profiles: Profile;
};

type Invitation = {
  id: string;
  code: string;
  role: string;
  expires_at: string;
  uses: number;
  max_uses: number;
};

type Org = {
  id: string;
  name: string;
};

export function MembersClient({ 
  initialMembers,
  initialInvites,
  organizations 
}: { 
  initialMembers: Member[];
  initialInvites: Invitation[];
  organizations: Org[];
}) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [invites, setInvites] = useState<Invitation[]>(initialInvites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Pagination & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.profiles?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.profiles?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const defaultOrgId = organizations.length === 1 ? organizations[0].id : "";

  async function handleToggleStatus(memberId: string, currentStatus: boolean) {
    const res = await toggleMemberStatus(memberId, !currentStatus);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Member access ${!currentStatus ? 'restored' : 'revoked'}`);
      setMembers(members.map(m => m.id === memberId ? { ...m, is_active: !currentStatus } : m));
    }
  }

  async function handleRemove(memberId: string) {
    if (!confirm("Are you sure you want to permanently remove this member?")) return;
    
    const res = await removeMember(memberId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Member removed");
      setMembers(members.filter(m => m.id !== memberId));
    }
  }

  async function handleGenerateInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await generateInviteCode(formData);
    
    if (res.error) {
      toast.error(res.error);
    } else if (res.data) {
      toast.success("Invite code generated!");
      setInvites([res.data, ...invites]);
      setIsModalOpen(false);
    }
    
    setIsSubmitting(false);
  }

  function copyToClipboard(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Invite code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Team Members</h1>
          <p className="text-muted-foreground mt-1">Manage staff access and generate invite codes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand/90 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Content Card (Members Table) */}
        <div className="xl:col-span-2 bg-background border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-white/5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Active Directory</h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search team..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 w-full text-sm bg-white dark:bg-black/20 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-gray-50/50 dark:bg-white/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                          {member.profiles?.first_name?.charAt(0).toUpperCase() || member.profiles?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {member.profiles?.first_name} {member.profiles?.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">{member.profiles?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-gray-700 dark:text-gray-300 font-medium">
                          {member.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          member.is_active 
                            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' 
                            : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                        }`}>
                          {member.is_active ? 'Active' : 'Revoked'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionDropdown 
                          actions={[
                            {
                              label: member.is_active ? 'Revoke Access' : 'Restore Access',
                              icon: member.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />,
                              onClick: () => handleToggleStatus(member.id, member.is_active)
                            },
                            {
                              label: "Remove Member",
                              icon: <Trash2 className="w-4 h-4" />,
                              danger: true,
                              onClick: () => handleRemove(member.id)
                            }
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredMembers.length > 0 && (
            <div className="p-4 border-t border-border">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>

        {/* Sidebar Card (Active Invites) */}
        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="p-4 border-b border-border bg-gray-50/50 dark:bg-white/5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Active Invite Codes</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {invites.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
                No active invite codes.
              </div>
            ) : (
              invites.map(invite => (
                <div key={invite.id} className="p-3 border border-border rounded-lg bg-surface flex flex-col gap-2 relative group">
                  <div className="flex justify-between items-start">
                    <div className="font-mono font-bold text-brand tracking-widest text-lg">
                      {invite.code}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(invite.code)}
                      className="text-gray-400 hover:text-brand transition-colors cursor-pointer p-1"
                      title="Copy code"
                    >
                      {copiedCode === invite.code ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                    <span className="capitalize bg-purple-50 text-brand px-2 py-0.5 rounded-md font-medium">
                      {invite.role.replace("_", " ")}
                    </span>
                    <span>{invite.uses} / {invite.max_uses} uses</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Expires: {new Date(invite.expires_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Generate Invite Code"
      >
        <form onSubmit={handleGenerateInvite} className="p-6 space-y-4">
              {organizations.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization</label>
                  <SearchableSelect 
                    name="organization_id" 
                    required
                    defaultValue={defaultOrgId}
                    placeholder="Select Organization..."
                    options={organizations.map(org => ({ label: org.name, value: org.id }))}
                  />
                </div>
              )}
              {organizations.length === 1 && (
                <input type="hidden" name="organization_id" value={defaultOrgId} />
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assign Role</label>
                <SearchableSelect 
                  name="role" 
                  required
                  defaultValue="floor_worker"
                  placeholder="Select Role..."
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "Ops Manager", value: "ops_manager" },
                    { label: "Supervisor", value: "supervisor" },
                    { label: "Floor Worker", value: "floor_worker" },
                    { label: "Billing", value: "billing" }
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Uses</label>
                  <input 
                    type="number" 
                    name="max_uses" 
                    required
                    min="1"
                    defaultValue="1"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Days Valid</label>
                  <input 
                    type="number" 
                    name="days_valid" 
                    required
                    min="1"
                    max="30"
                    defaultValue="7"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium bg-brand text-white hover:bg-brand/90 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Generating..." : "Generate Code"}
                </button>
              </div>
            </form>
      </Modal>
    </div>
  );
}

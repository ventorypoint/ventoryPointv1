"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Users, Mail, Phone, Building2, X, Trash2, Edit2 } from "lucide-react";
import { createClientAccount, deleteClientAccount, updateClientAccount } from "../actions";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { TablePagination } from "@/components/ui/table-pagination";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Modal } from "@/components/ui/modal";

type ClientAccount = {
  id: string;
  name: string;
  short_code: string;
  status: 'active' | 'suspended';
  primary_contact_email: string | null;
  primary_contact_name: string | null;
  primary_contact_phone: string | null;
  organization_id: string;
};

type Org = {
  id: string;
  name: string;
};

export function ClientsClient({ 
  initialClients, 
  organizations 
}: { 
  initialClients: ClientAccount[];
  organizations: Org[];
}) {
  const [clients, setClients] = useState<ClientAccount[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.short_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primary_contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primary_contact_email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form states for auto-generating short code
  const [formName, setFormName] = useState("");
  const [formShortCode, setFormShortCode] = useState("");
  const [isShortCodeEdited, setIsShortCodeEdited] = useState(false);

  const defaultOrgId = organizations.length === 1 ? organizations[0].id : "";

  function openEditModal(client: ClientAccount) {
    setEditingClient(client);
    setFormName(client.name);
    setFormShortCode(client.short_code);
    setIsShortCodeEdited(true);
    setIsModalOpen(true);
  }

  function openCreateModal() {
    setEditingClient(null);
    setFormName("");
    setFormShortCode("");
    setIsShortCodeEdited(false);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingClient(null);
      setFormName("");
      setFormShortCode("");
      setIsShortCodeEdited(false);
    }, 200);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setFormName(val);
    
    if (!isShortCodeEdited) {
      const words = val.trim().split(/\s+/);
      let gen = "";
      if (val.trim().length === 0) {
        gen = "";
      } else if (words.length >= 2) {
        gen = words.slice(0, 3).map(w => w[0]).join("").toUpperCase();
      } else {
        gen = val.slice(0, 3).toUpperCase();
      }
      setFormShortCode(gen);
    }
  }

  function handleShortCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormShortCode(e.target.value.toUpperCase());
    setIsShortCodeEdited(true);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (editingClient) {
      res = await updateClientAccount(editingClient.id, formData);
    } else {
      res = await createClientAccount(formData);
    }
    
    if (res.error) {
      toast.error(res.error);
    } else if (res.data) {
      if (editingClient) {
        toast.success("Client account updated successfully");
        setClients(clients.map(c => c.id === res.data.id ? res.data : c));
      } else {
        toast.success("Client account created successfully");
        setClients([...clients, res.data]);
      }
      handleCloseModal();
    }
    
    setIsSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this client account?")) return;
    
    const res = await deleteClientAccount(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Client account deleted");
      setClients(clients.filter(c => c.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Client Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage the brands and merchants your 3PL serves.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand/90 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 w-full text-sm bg-white dark:bg-black/20 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-gray-50/50 dark:bg-white/5 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Client Name</th>
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Primary Contact</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="w-8 h-8 text-gray-300" />
                      <p>No client accounts found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-purple-50 dark:bg-brand/10 flex items-center justify-center text-brand font-bold text-lg">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      {client.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-md text-xs font-mono font-medium">
                        {client.short_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' 
                          : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {client.primary_contact_name ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{client.primary_contact_name}</span>
                          <span className="text-xs text-muted-foreground">{client.primary_contact_email}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionDropdown 
                        actions={[
                          {
                            label: "Edit",
                            icon: <Edit2 className="w-4 h-4" />,
                            onClick: () => openEditModal(client)
                          },
                          {
                            label: "Delete",
                            icon: <Trash2 className="w-4 h-4" />,
                            danger: true,
                            onClick: () => handleDelete(client.id)
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
        {filteredClients.length > 0 && (
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

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingClient ? "Edit Client Account" : "Add Client Account"}
      >
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {organizations.length > 1 && !editingClient && (
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
              {organizations.length === 1 && !editingClient && (
                <input type="hidden" name="organization_id" value={defaultOrgId} />
              )}
              {editingClient && (
                <input type="hidden" name="organization_id" value={editingClient.organization_id} />
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Brand Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formName}
                  onChange={handleNameChange}
                  placeholder="e.g. Acme Shoes"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Code (Prefix)</label>
                <input 
                  type="text" 
                  name="short_code" 
                  required
                  value={formShortCode}
                  onChange={handleShortCodeChange}
                  placeholder="e.g. ACM"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand font-mono uppercase"
                />
                <p className="text-xs text-muted-foreground">Used as a prefix for orders and inventory (e.g., ACM-1004).</p>
              </div>

              <div className="pt-2 border-t border-border mt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Primary Contact (Optional)</h3>
                
                <div className="space-y-3">
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      name="primary_contact_name" 
                      defaultValue={editingClient?.primary_contact_name || ""}
                      placeholder="Contact Name"
                      className="w-full pl-9 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      name="primary_contact_email" 
                      defaultValue={editingClient?.primary_contact_email || ""}
                      placeholder="Contact Email"
                      className="w-full pl-9 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" 
                      name="primary_contact_phone" 
                      defaultValue={editingClient?.primary_contact_phone || ""}
                      placeholder="Contact Phone"
                      className="w-full pl-9 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium bg-brand text-white hover:bg-brand/90 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (editingClient ? "Saving..." : "Adding...") : (editingClient ? "Save Changes" : "Add Client")}
                </button>
              </div>
            </form>
      </Modal>
    </div>
  );
}

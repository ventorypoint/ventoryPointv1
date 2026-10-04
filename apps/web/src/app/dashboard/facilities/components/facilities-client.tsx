"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Building, MapPin, Clock, X, Trash2, Edit2 } from "lucide-react";
import { createFacility, deleteFacility, updateFacility } from "../actions";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { TablePagination } from "@/components/ui/table-pagination";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Modal } from "@/components/ui/modal";

type Facility = {
  id: string;
  name: string;
  short_code: string;
  timezone: string;
  address: string;
  organization_id: string;
  created_at: string;
};

type Org = {
  id: string;
  name: string;
};

export function FacilitiesClient({ 
  initialFacilities, 
  organizations 
}: { 
  initialFacilities: Facility[];
  organizations: Org[];
}) {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.short_code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [facilities, searchQuery]);

  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);
  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form states for auto-generating short code
  const [formName, setFormName] = useState("");
  const [formShortCode, setFormShortCode] = useState("");
  const [isShortCodeEdited, setIsShortCodeEdited] = useState(false);

  // If the user only has one org, we can default to it
  const defaultOrgId = organizations.length === 1 ? organizations[0].id : "";

  function openEditModal(facility: Facility) {
    setEditingFacility(facility);
    setFormName(facility.name);
    setFormShortCode(facility.short_code);
    setIsShortCodeEdited(true);
    setIsModalOpen(true);
  }

  function openCreateModal() {
    setEditingFacility(null);
    setFormName("");
    setFormShortCode("");
    setIsShortCodeEdited(false);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingFacility(null);
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
    if (editingFacility) {
      res = await updateFacility(editingFacility.id, formData);
    } else {
      res = await createFacility(formData);
    }
    
    if (res.error) {
      toast.error(res.error);
    } else if (res.data) {
      if (editingFacility) {
        toast.success("Facility updated successfully");
        setFacilities(facilities.map(f => f.id === res.data.id ? res.data : f));
      } else {
        toast.success("Facility created successfully");
        setFacilities([...facilities, res.data]);
      }
      handleCloseModal();
    }
    
    setIsSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this facility?")) return;
    
    const res = await deleteFacility(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Facility deleted");
      setFacilities(facilities.filter(f => f.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Facilities</h1>
          <p className="text-muted-foreground mt-1">Manage your warehouses and fulfillment centers.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand/90 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Facility
        </button>
      </div>

      {/* Main Content Card (Table) */}
      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search facilities..." 
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
                <th className="px-6 py-4 font-semibold">Facility Name</th>
                <th className="px-6 py-4 font-semibold">Short Code</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Timezone</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedFacilities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Building className="w-8 h-8 text-gray-300" />
                      <p>No facilities found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedFacilities.map((facility) => (
                  <tr key={facility.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-purple-50 dark:bg-brand/10 flex items-center justify-center text-brand">
                        <Building className="w-4 h-4" />
                      </div>
                      {facility.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-mono font-medium">
                        {facility.short_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate max-w-[200px]">{facility.address || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {facility.timezone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionDropdown 
                        actions={[
                          {
                            label: "Edit",
                            icon: <Edit2 className="w-4 h-4" />,
                            onClick: () => openEditModal(facility)
                          },
                          {
                            label: "Delete",
                            icon: <Trash2 className="w-4 h-4" />,
                            danger: true,
                            onClick: () => handleDelete(facility.id)
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
        {filteredFacilities.length > 0 && (
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
        title={editingFacility ? "Edit Facility" : "Add New Facility"}
      >
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {organizations.length > 1 && !editingFacility && (
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
              {organizations.length === 1 && !editingFacility && (
                <input type="hidden" name="organization_id" value={defaultOrgId} />
              )}
              {editingFacility && (
                <input type="hidden" name="organization_id" value={editingFacility.organization_id} />
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Facility Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formName}
                  onChange={handleNameChange}
                  placeholder="e.g. West Coast Hub"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Code</label>
                  <input 
                    type="text" 
                    name="short_code" 
                    required
                    value={formShortCode}
                    onChange={handleShortCodeChange}
                    placeholder="e.g. WCH"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand font-mono uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                  <SearchableSelect 
                    name="timezone" 
                    required
                    defaultValue={editingFacility?.timezone || "America/Los_Angeles"}
                    options={[
                      { label: "Eastern (EST/EDT)", value: "America/New_York" },
                      { label: "Central (CST/CDT)", value: "America/Chicago" },
                      { label: "Mountain (MST/MDT)", value: "America/Denver" },
                      { label: "Pacific (PST/PDT)", value: "America/Los_Angeles" },
                      { label: "UTC", value: "UTC" },
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <textarea 
                  name="address" 
                  defaultValue={editingFacility?.address || ""}
                  placeholder="Full street address..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                />
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
                  {isSubmitting ? (editingFacility ? "Saving..." : "Creating...") : (editingFacility ? "Save Changes" : "Create Facility")}
                </button>
              </div>
            </form>
      </Modal>
    </div>
  );
}

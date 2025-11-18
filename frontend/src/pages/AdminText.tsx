// src/pages/AdminDashboard.tsx

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  bannerUrl?: string;
  createdAt: string;
}

interface Tool {
  id: number;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  bannerUrl?: string;
  categoryId: number;
  planType: string;
  isTrending: boolean;
  isNew: boolean;
  createdAt: string;
  category: Category;
}

interface AdminDashboardProps {
  onBack?: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"category" | "tool">("category");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    iconUrl: "",
  });

  const [toolForm, setToolForm] = useState({
    name: "",
    description: "",
    url: "",
    bannerUrl: "",
    imageUrl: "",
    categoryId: "",
    planType: "", 
    isTrending: false,
    isNew: false,
  });

  // Fetch initial data
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => toast.error("Failed to fetch categories"));

    fetch("http://localhost:4000/api/tools")
      .then((res) => res.json())
      .then(setTools)
      .catch(() => toast.error("Failed to fetch tools"));
  }, []);

  // ---- CATEGORY ----
  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `http://localhost:4000/api/categories/${editingCategory.id}`
        : "http://localhost:4000/api/categories";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (!response.ok) throw new Error("Failed to save category");
      const data = await response.json();

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c.id === data.id ? data : c))
        );
        toast.success("Category updated");
      } else {
        setCategories((prev) => [...prev, data]);
        toast.success("Category added");
      }

      setCategoryDialogOpen(false);
      setEditingCategory(null);
    } catch {
      toast.error("Error saving category");
    }
  };

  // ---- TOOL ----
  const handleSaveTool = async () => {
    const { name, description, url, bannerUrl, imageUrl, categoryId, planType, isTrending, isNew } = toolForm;
    const categoryIdNum = parseInt(categoryId);
    if (!name || !description || !categoryIdNum) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const method = editingTool ? "PUT" : "POST";
      const endpoint = editingTool
        ? `http://localhost:4000/api/tools/${editingTool.id}`
        : "http://localhost:4000/api/tools";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          bannerUrl,
          imageUrl,
          url,
          categoryId: categoryIdNum,
          planType,
          isTrending,
          isNew,
        }),
      });


      // - [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
      // - [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

      if (!response.ok) throw new Error("Failed to save tool");
      const data = await response.json();

      if (editingTool) {
        setTools((prev) =>
          prev.map((t) => (t.id === data.id ? data : t))
        );
        toast.success("Tool updated");
      } else {
        setTools((prev) => [...prev, data]);
        toast.success("Tool added");
      }

      setToolDialogOpen(false);
      setEditingTool(null);
    } catch (err) {
      toast.error("Error saving tool: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // ---- DELETE ----
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    const endpoint =
      deleteType === "category"
        ? `http://localhost:4000/api/categories/${deleteId}`
        : `http://localhost:4000/api/tools/${deleteId}`;

    try {
      await fetch(endpoint, { method: "DELETE" });
      if (deleteType === "category")
        setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      else setTools((prev) => prev.filter((t) => t.id !== deleteId));

      toast.success(`${deleteType} deleted`);
    } catch {
      toast.error(`Failed to delete ${deleteType}`);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // ---- UI ----
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl md:text-5xl mb-4">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Manage categories and tools
        </p>

        <Tabs defaultValue="categories">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          {/* -------- CATEGORIES -------- */}
          <TabsContent value="categories" className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">Categories ({categories.length})</h2>
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({
                      name: "",
                      description: "",
                      iconUrl: "",
                    });
                  }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Edit" : "Add"} Category</DialogTitle>
                    <DialogDescription>
                      {editingCategory ? "Update details" : "Enter new category details"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Icon URL</Label>
                      <Input
                        value={categoryForm.iconUrl}
                        onChange={(e) => setCategoryForm({ ...categoryForm, iconUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveCategory}>{editingCategory ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell className="max-w-sm truncate">{cat.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingCategory(cat);
                          setCategoryForm({
                            name: cat.name,
                            description: cat.description,
                            iconUrl: cat.iconUrl,
                          });
                          setCategoryDialogOpen(true);
                        }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setDeleteType("category");
                          setDeleteId(cat.id);
                          setDeleteDialogOpen(true);
                        }}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* -------- TOOLS -------- */}
          <TabsContent value="tools" className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">Tools ({tools.length})</h2>
              <Dialog open={toolDialogOpen} onOpenChange={setToolDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingTool(null);
                    setToolForm({
                      name: "",
                      description: "",
                      url: "",
                      bannerUrl: "",
                      imageUrl: "",
                      categoryId: "",
                      planType: "",
                      isTrending: false,
                      isNew: false,
                    });
                  }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Tool
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingTool ? "Edit" : "Add"} Tool</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div><Label>Name</Label><Input value={toolForm.name} onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })} /></div>
                    <div><Label>Description</Label><Textarea value={toolForm.description} onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })} /></div>
                    <div><Label>URL</Label><Input value={toolForm.url} onChange={(e) => setToolForm({ ...toolForm, url: e.target.value })} /></div>
                    <div><Label>Banner URL</Label><Input value={toolForm.bannerUrl} onChange={(e) => setToolForm({ ...toolForm, bannerUrl: e.target.value })} /></div>
                    <div><Label>Image URL</Label><Input value={toolForm.imageUrl} onChange={(e) => setToolForm({ ...toolForm, imageUrl: e.target.value })} /></div>
                    <div>
                      <Label>Category</Label>
                      <Select value={toolForm.categoryId} onValueChange={(v) => setToolForm({ ...toolForm, categoryId: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Plan Type</Label><Input value={toolForm.planType} onChange={(e) => setToolForm({ ...toolForm, planType: e.target.value })} /></div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isTrending" checked={toolForm.isTrending} onCheckedChange={(checked: boolean) => setToolForm({ ...toolForm, isTrending: checked })} />
                      <Label htmlFor="isTrending">Trending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isNew" checked={toolForm.isNew} onCheckedChange={(checked: boolean) => setToolForm({ ...toolForm, isNew: checked })} />
                      <Label htmlFor="isNew">New</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setToolDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveTool}>{editingTool ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Plan Type</TableHead>
                    <TableHead>Trending</TableHead>
                    <TableHead>New</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tools.map((tool) => {
                    const category = categories.find(c => c.id === tool.categoryId);
                    return (
                      <TableRow key={tool.id}>
                        <TableCell>{tool.name}</TableCell>
                        <TableCell>{category?.name || 'Unknown'}</TableCell>
                        <TableCell className="max-w-xs truncate">{tool.description}</TableCell>
                        <TableCell>{tool.planType}</TableCell>
                        <TableCell>{tool.isTrending ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{tool.isNew ? 'Yes' : 'No'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setEditingTool(tool);
                            setToolForm({
                              ...tool,
                              categoryId: tool.categoryId.toString(),
                              bannerUrl: tool.bannerUrl || "",
                              imageUrl: tool.imageUrl || "",
                            });
                            setToolDialogOpen(true);
                          }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setDeleteType("tool");
                            setDeleteId(tool.id);
                            setDeleteDialogOpen(true);
                          }}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* DELETE CONFIRM */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

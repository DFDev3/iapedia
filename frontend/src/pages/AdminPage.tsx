// src/pages/AdminPage.tsx

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Database, Pencil, Plus, Trash2, Users, Package, Layers } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  iconUrl: string;
  bannerUrl?: string;
  createdAt: string;
}

interface Label {
  id: number;
  name: string;
  slug: string;
  category: string;
  color: string;
  description?: string;
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
  labels?: Array<{ label: Label }>;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"category" | "tool" | "user">("category");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    fullDescription: "",
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
    selectedLabels: [] as number[],
  });

  const [userForm, setUserForm] = useState({
    email: "",
    name: "",
    role: "USER",
    password: "",
  });

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchTools();
    fetchLabels();
    fetchUsers();
  }, []);

  const fetchCategories = () => {
    fetch("http://localhost:4000/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => toast.error("Error al cargar categorías"));
  };

  const fetchTools = () => {
    fetch("http://localhost:4000/api/tools")
      .then((res) => res.json())
      .then(setTools)
      .catch(() => toast.error("Error al cargar herramientas"));
  };

  const fetchLabels = () => {
    fetch("http://localhost:4000/api/labels")
      .then((res) => res.json())
      .then(setLabels)
      .catch(() => toast.error("Error al cargar etiquetas"));
  };

  const fetchUsers = () => {
    fetch("http://localhost:4000/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => toast.error("Error al cargar usuarios"));
  };

  // ---- SEEDER ----
  const handleRunSeeder = async () => {
    if (!confirm('Esto eliminará todos los datos existentes y volverá a sembrar la base de datos. ¿Estás seguro?')) {
      return;
    }

    setIsSeeding(true);
    try {
      const response = await fetch('http://localhost:4000/api/seed/run', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        const stats = data.stats;
        const message = `¡Base de datos sembrada! ${stats.users} usuarios, ${stats.labels} etiquetas, ${stats.categories} categorías, ${stats.tools} herramientas`;
        toast.success(message);
        // Refresh data
        fetchCategories();
        fetchTools();
        fetchLabels();
        fetchUsers();
      } else {
        toast.error('Error al sembrar la base de datos');
      }
    } catch (error) {
      toast.error('Error ejecutando el sembrador');
      console.error('Seeder error:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  // ---- CATEGORY ----
  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.description) {
      toast.error("Por favor completa todos los campos");
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

      if (!response.ok) throw new Error("Error al guardar categoría");
      
      toast.success(editingCategory ? "Categoría actualizada" : "Categoría creada");
      fetchCategories();
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "", fullDescription: "", iconUrl: "" });
    } catch (error) {
      toast.error("Error al guardar categoría");
    }
  };

  // ---- TOOL ----
  const handleSaveTool = async () => {
    if (!toolForm.name || !toolForm.categoryId) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const method = editingTool ? "PUT" : "POST";
      const url = editingTool
        ? `http://localhost:4000/api/tools/${editingTool.id}`
        : "http://localhost:4000/api/tools";

      const payload = {
        ...toolForm,
        categoryId: parseInt(toolForm.categoryId),
        labelIds: toolForm.selectedLabels,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al guardar herramienta");
      
      toast.success(editingTool ? "Herramienta actualizada" : "Herramienta creada");
      fetchTools();
      setToolDialogOpen(false);
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
        selectedLabels: [],
      });
    } catch (error) {
      toast.error("Error al guardar herramienta");
    }
  };

  // ---- USER ----
  const handleSaveUser = async () => {
    if (!userForm.email || !userForm.name || (!editingUser && !userForm.password)) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `http://localhost:4000/api/users/${editingUser.id}`
        : "http://localhost:4000/api/users";

      const payload = editingUser
        ? { name: userForm.name, role: userForm.role }
        : userForm;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al guardar usuario");
      
      toast.success(editingUser ? "Usuario actualizado" : "Usuario creado");
      fetchUsers();
      setUserDialogOpen(false);
      setEditingUser(null);
      setUserForm({ email: "", name: "", role: "USER", password: "" });
    } catch (error) {
      toast.error("Error al guardar usuario");
    }
  };

  // ---- DELETE ----
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      let url = "";
      if (deleteType === "category") url = `http://localhost:4000/api/categories/${deleteId}`;
      else if (deleteType === "tool") url = `http://localhost:4000/api/tools/${deleteId}`;
      else if (deleteType === "user") url = `http://localhost:4000/api/users/${deleteId}`;

      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar");

      toast.success(
        deleteType === "category" ? "Categoría eliminada" :
        deleteType === "tool" ? "Herramienta eliminada" :
        "Usuario eliminado"
      );

      if (deleteType === "category") fetchCategories();
      else if (deleteType === "tool") fetchTools();
      else if (deleteType === "user") fetchUsers();

      setDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona tu base de datos, herramientas, categorías y usuarios</p>
        </div>

        {/* Seed Database Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Base de Datos
            </CardTitle>
            <CardDescription>
              Sembrar la base de datos eliminará todos los datos existentes y creará datos de ejemplo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleRunSeeder} 
              disabled={isSeeding}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Database className="w-4 h-4 mr-2" />
              {isSeeding ? 'Sembrando...' : 'Sembrar Base de Datos'}
            </Button>
          </CardContent>
        </Card>

        {/* Tabs for CRUD Operations */}
        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Herramientas
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuarios
            </TabsTrigger>
          </TabsList>

          {/* TOOLS TAB */}
          <TabsContent value="tools" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gestión de Herramientas</h2>
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
                      selectedLabels: [],
                    });
                  }}>
                    <Plus className="w-4 h-4 mr-2" /> Agregar Herramienta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingTool ? "Editar" : "Agregar"} Herramienta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div><Label>Nombre</Label><Input value={toolForm.name} onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })} /></div>
                    <div><Label>Descripción</Label><Textarea value={toolForm.description} onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })} /></div>
                    <div><Label>URL</Label><Input value={toolForm.url} onChange={(e) => setToolForm({ ...toolForm, url: e.target.value })} /></div>
                    <div><Label>URL del Banner</Label><Input value={toolForm.bannerUrl} onChange={(e) => setToolForm({ ...toolForm, bannerUrl: e.target.value })} /></div>
                    <div><Label>URL de la Imagen</Label><Input value={toolForm.imageUrl} onChange={(e) => setToolForm({ ...toolForm, imageUrl: e.target.value })} /></div>
                    <div>
                      <Label>Categoría</Label>
                      <Select value={toolForm.categoryId} onValueChange={(v) => setToolForm({ ...toolForm, categoryId: v })}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tipo de Plan</Label>
                      <Select value={toolForm.planType} onValueChange={(v) => setToolForm({ ...toolForm, planType: v })}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar tipo de plan" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE">Gratis</SelectItem>
                          <SelectItem value="PAID">Pago</SelectItem>
                          <SelectItem value="FREEMIUM">Freemium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isTrending" checked={toolForm.isTrending} onCheckedChange={(checked: boolean) => setToolForm({ ...toolForm, isTrending: checked })} />
                      <Label htmlFor="isTrending">Tendencia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isNew" checked={toolForm.isNew} onCheckedChange={(checked: boolean) => setToolForm({ ...toolForm, isNew: checked })} />
                      <Label htmlFor="isNew">Nuevo</Label>
                    </div>

                    {/* Label Selection */}
                    <div className="space-y-3">
                      <Label>Etiquetas</Label>
                      <div className="space-y-4">
                        {["PRICING", "CAPABILITY", "STATUS", "SPECIALTY"].map((category) => {
                          const categoryLabels = labels.filter((l) => l.category === category);
                          if (categoryLabels.length === 0) return null;

                          return (
                            <div key={category} className="space-y-2">
                              <h3 className="text-sm font-medium text-muted-foreground capitalize">
                                {category.toLowerCase()}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {categoryLabels.map((label) => {
                                  const isSelected = toolForm.selectedLabels.includes(label.id);
                                  return (
                                    <button
                                      key={label.id}
                                      type="button"
                                      onClick={() => {
                                        setToolForm({
                                          ...toolForm,
                                          selectedLabels: isSelected
                                            ? toolForm.selectedLabels.filter((id) => id !== label.id)
                                            : [...toolForm.selectedLabels, label.id],
                                        });
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        isSelected
                                          ? "text-white shadow-md"
                                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                      }`}
                                      style={
                                        isSelected
                                          ? { backgroundColor: label.color }
                                          : undefined
                                      }
                                    >
                                      {label.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setToolDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSaveTool}>{editingTool ? "Actualizar" : "Crear"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tools.map((tool) => {
                      const category = categories.find(c => c.id === tool.categoryId);
                      return (
                        <TableRow key={tool.id}>
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell>{category?.name || 'Desconocida'}</TableCell>
                          <TableCell>{tool.planType}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {tool.isTrending && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Tendencia</span>}
                              {tool.isNew && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Nuevo</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditingTool(tool);
                              setToolForm({
                                ...tool,
                                categoryId: tool.categoryId.toString(),
                                bannerUrl: tool.bannerUrl || "",
                                imageUrl: tool.imageUrl || "",
                                selectedLabels: tool.labels?.map((tl) => tl.label.id) || [],
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATEGORIES TAB */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gestión de Categorías</h2>
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: "", description: "", fullDescription: "", iconUrl: "" });
                  }}>
                    <Plus className="w-4 h-4 mr-2" /> Agregar Categoría
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Editar" : "Agregar"} Categoría</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div><Label>Nombre</Label><Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} /></div>
                    <div><Label>Descripción</Label><Input value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} /></div>
                    <div><Label>Descripción Completa</Label><Textarea value={categoryForm.fullDescription} onChange={(e) => setCategoryForm({ ...categoryForm, fullDescription: e.target.value })} /></div>
                    <div><Label>URL del Ícono</Label><Input value={categoryForm.iconUrl} onChange={(e) => setCategoryForm({ ...categoryForm, iconUrl: e.target.value })} /></div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSaveCategory}>{editingCategory ? "Actualizar" : "Crear"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setEditingCategory(category);
                            setCategoryForm(category);
                            setCategoryDialogOpen(true);
                          }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setDeleteType("category");
                            setDeleteId(category.id);
                            setDeleteDialogOpen(true);
                          }}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Gestión de Usuarios</h2>
              <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingUser(null);
                    setUserForm({ email: "", name: "", role: "USER", password: "" });
                  }}>
                    <Plus className="w-4 h-4 mr-2" /> Agregar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingUser ? "Editar" : "Agregar"} Usuario</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {!editingUser && (
                      <div><Label>Email</Label><Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} /></div>
                    )}
                    <div><Label>Nombre</Label><Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} /></div>
                    <div>
                      <Label>Rol</Label>
                      <Select value={userForm.role} onValueChange={(v) => setUserForm({ ...userForm, role: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">Usuario</SelectItem>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {!editingUser && (
                      <div><Label>Contraseña</Label><Input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} /></div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSaveUser}>{editingUser ? "Actualizar" : "Crear"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Fecha de Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setEditingUser(user);
                            setUserForm({ email: user.email, name: user.name, role: user.role, password: "" });
                            setUserDialogOpen(true);
                          }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setDeleteType("user");
                            setDeleteId(user.id);
                            setDeleteDialogOpen(true);
                          }}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* DELETE CONFIRM */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleConfirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

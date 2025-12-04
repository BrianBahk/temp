"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  ArrowLeft,
  Search,
  Mail,
  Calendar,
  Award,
  ShieldCheck
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  pointsEarned: number;
  createdAt: string;
  _count?: {
    orders: number;
    reviews: number;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await fetch('/api/admin/users', {
      //   headers: { 'x-user-id': 'admin-id' }
      // });
      // const data = await response.json();
      // setUsers(data);
      
      // Simulated data from seed
      setUsers([
        {
          id: "1",
          email: "admin@readsphere.com",
          name: "Admin User",
          role: "admin",
          points: 0,
          pointsEarned: 0,
          createdAt: new Date().toISOString(),
          _count: {
            orders: 0,
            reviews: 0,
          },
        },
        {
          id: "2",
          email: "test@example.com",
          name: "Test User",
          role: "user",
          points: 100,
          pointsEarned: 100,
          createdAt: new Date().toISOString(),
          _count: {
            orders: 0,
            reviews: 0,
          },
        },
      ]);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">
                View and manage user accounts
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No users found</p>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : "No users in the system yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge
                          variant={user.role === "admin" ? "default" : "outline"}
                        >
                          {user.role === "admin" ? (
                            <div className="flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              Admin
                            </div>
                          ) : (
                            "User"
                          )}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-center border-l pl-6">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                          <Award className="h-4 w-4" />
                        </div>
                        <p className="text-2xl font-bold">{user.points}</p>
                        <p className="text-xs text-muted-foreground">Points</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {user._count?.orders || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Orders</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {user._count?.reviews || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Points Earned */}
                  {user.pointsEarned > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Total points earned: {user.pointsEarned.toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        <Card className="mt-8 bg-secondary/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "admin").length}
                </p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "user").length}
                </p>
                <p className="text-sm text-muted-foreground">Regular Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.reduce((sum, u) => sum + u.pointsEarned, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

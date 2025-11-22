"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy, limit, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Report {
  postId: string;
  reporterId: string;
  reason?: string;
  createdAt: any;
}

export default function AdminPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!userData) return;

    // Check if user is admin or superAdmin
    if (!userData.isAdmin) {
      router.push("/feed");
      return;
    }

    loadReports();
  }, [userData, router]);

  const loadReports = async () => {
    try {
      const q = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const reportsData: Report[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        reportsData.push({
          postId: doc.id.split("/")[0],
          reporterId: data.reporterId || doc.id.split("/")[1],
          reason: data.reason,
          createdAt: data.createdAt,
        });
      });
      
      setReports(reportsData);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Delete this post and ban the user?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      // Ban user logic would go here
      loadReports();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDismissReport = async (postId: string, reporterId: string) => {
    try {
      await deleteDoc(doc(db, "reports", `${postId}/${reporterId}`));
      loadReports();
    } catch (error) {
      console.error("Error dismissing report:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredReports = reports.filter((report) =>
    report.postId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-display font-bold mb-6">Admin Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by post ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          {filteredReports.length === 0 ? (
            <p className="text-muted-foreground">No reports found</p>
          ) : (
            <div className="space-y-2">
              {filteredReports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-2xl"
                >
                  <div>
                    <p className="font-semibold">Post ID: {report.postId}</p>
                    <p className="text-sm text-muted-foreground">
                      Reporter: {report.reporterId}
                    </p>
                    {report.reason && (
                      <p className="text-sm mt-1">{report.reason}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePost(report.postId)}
                    >
                      Delete & Ban
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDismissReport(report.postId, report.reporterId)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import PostJobForm from "@/components/PostJobForm";
import TopNav from "@/components/TopNav";

export default function PostPage() {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <main className="px-6 py-6">
        <div className="max-w-[860px]">
          <h1 className="mb-6 text-lg font-semibold text-gray-900">求人投稿</h1>
          <PostJobForm />
        </div>
      </main>
    </div>
  );
}

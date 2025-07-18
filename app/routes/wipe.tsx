import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";

interface ResumeData {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: any;
}

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<ResumeData[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadResumes = async () => {
        setLoadingResumes(true);
        try {
            const resumeItems = (await kv.list('resume:*', true)) as any[];
            const parsedResumes = resumeItems?.map((item) => JSON.parse(item.value) as ResumeData) || [];
            setResumes(parsedResumes);
        } catch (error) {
            console.error('Error loading resumes:', error);
        } finally {
            setLoadingResumes(false);
        }
    };

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    useEffect(() => {
        if (auth.isAuthenticated) {
            loadResumes();
        }
    }, [auth.isAuthenticated]);

    const handleDeleteResume = async (resume: ResumeData) => {
        if (!confirm(`Are you sure you want to delete the resume for ${resume.companyName || 'Unknown Company'}?`)) {
            return;
        }

        setDeletingId(resume.id);
        try {
            // Try to delete the resume file (ignore if it doesn't exist)
            try {
                await fs.delete(resume.resumePath);
            } catch (resumeError) {
                // File may have been cleaned up automatically - this is normal
            }
            
            // Try to delete the image file (ignore if it doesn't exist)
            try {
                await fs.delete(resume.imagePath);
            } catch (imageError) {
                // File may have been cleaned up automatically - this is normal
            }
            
            // Delete the KV entry (this is the most important part)
            await kv.delete(`resume:${resume.id}`);
            
            // Reload the list
            await loadResumes();
        } catch (error) {
            console.error('Unexpected error during resume deletion:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('Are you sure you want to delete ALL resumes? This action cannot be undone.')) {
            return;
        }

        try {
            // Delete all resume files (ignore errors for individual files)
            for (const resume of resumes) {
                try {
                    await fs.delete(resume.resumePath);
                } catch (resumeError) {
                    // File may have been cleaned up automatically - this is normal
                }
                
                try {
                    await fs.delete(resume.imagePath);
                } catch (imageError) {
                    // File may have been cleaned up automatically - this is normal
                }
            }
            
            // Clear all KV entries
            await kv.flush();
            
            // Reload the list
            await loadResumes();
        } catch (error) {
            console.error('Error deleting all resumes:', error);
            alert('Failed to delete all resumes. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <img src="/images/resume-scan-2.gif" className="w-[200px] mx-auto" alt="Loading" />
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-red-600">Error: {error}</p>
                        <button 
                            onClick={clearError}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Manage Your Resumes</h1>
                    <h2>Delete individual resumes or clear all data</h2>
                </div>

                {loadingResumes ? (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading" />
                        <p className="mt-4 text-gray-600">Loading resumes...</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                        <p className="text-gray-600 text-lg">No resumes found.</p>
                        <button 
                            onClick={() => navigate('/upload')}
                            className="primary-button w-fit text-xl font-semibold"
                        >
                            Upload Your First Resume
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {resumes.length} Resume{resumes.length !== 1 ? 's' : ''} Found
                            </h3>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                                onClick={handleDeleteAll}
                            >
                                Delete All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {resumes.map((resume) => (
                                <div 
                                    key={resume.id} 
                                    className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center"
                                >
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            {resume.companyName || 'Unknown Company'}
                                        </h4>
                                        <p className="text-gray-600">
                                            {resume.jobTitle || 'No job title specified'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            ID: {resume.id}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate(`/resume/${resume.id}`)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteResume(resume)}
                                            disabled={deletingId === resume.id}
                                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
                                        >
                                            {deletingId === resume.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default WipeApp;
import {type FormEvent, useState} from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
// This import now points to the file with the corrected prepareInstructions
import {prepareInstructions} from "../../constants";

const Upload = () =>{
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async({companyName, jobTitle, jobDescription, file} : { companyName: string, jobTitle: string, jobDescription: string, file: File}) =>{
        setIsProcessing(true);
        setStatusText('Uploading the file...');

        try {
            const uploadedFile = await fs.upload([file])
            if(!uploadedFile) throw new Error('Failed to upload file');

            setStatusText('Converting to image..');
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) throw new Error('Failed to convert pdf to image');

            setStatusText('uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) throw new Error('Failed to upload image');

            setStatusText('Preparing data..');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '',
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing...');
            const feedbackResponse = await ai.feedback(
                uploadedFile.path,
                // =========================================================
                // THIS IS THE ONLY LINE THAT NEEDED TO BE CHANGED
                // It now matches the new, simpler function signature.
                prepareInstructions({ jobTitle, jobDescription })
                // =========================================================
            );

            if(!feedbackResponse || !feedbackResponse.message?.content) {
                throw new Error('AI analysis returned an invalid response.');
            }

            let feedbackText = typeof feedbackResponse.message.content === 'string'
                ? feedbackResponse.message.content
                : Array.isArray(feedbackResponse.message.content) && feedbackResponse.message.content[0]?.text
                    ? feedbackResponse.message.content[0].text
                    : '';


            const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error("No JSON object found in the AI response. Raw text:", feedbackText);
                throw new Error("AI did not return a valid data structure.");
            }
            feedbackText = jsonMatch[0];

            try {
                data.feedback = JSON.parse(feedbackText);
            } catch (parseError) {
                console.error("Failed to parse JSON even after cleaning. Raw text:", feedbackText, "Error:", parseError);
                throw new Error("Failed to process the AI's feedback.");
            }

            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete! You can now view your feedback.');
            console.log(data);

            navigate(`/resume/${uuid}`);

        } catch (error) {
            console.error("An error occurred during analysis:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setStatusText(`Error: ${errorMessage}`);
            setIsProcessing(false);
        }
    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) {
            alert("Please select a resume file to upload.");
            return;
        };

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart Feedback For Your Dream Job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" alt="Analyzing resume animation" />
                        </>
                    ) : (
                        <h2>
                            Drop your resume for an ATS score and improvement tips
                        </h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input required type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input required type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea required rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>

                        </form>
                    )}
                </div>
            </section>
        </main>
    )
};

export default Upload;
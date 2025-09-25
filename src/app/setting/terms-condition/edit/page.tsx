// "use client";

// import { useEffect, useRef, useState } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";
// import { Button } from "@/components/ui/button";
// import {
//   useGetTermsAndConditionsQuery,
//   useSetTermsAndConditionsMutation,
// } from "@/redux/feature/settingAPI";
// import Loading from "@/components/loading/Loading";

// const EditAboutUs = () => {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const quillRef = useRef<Quill | null>(null);
//   const [content, setContent] = useState<string>("");

//   const {
//     data: terms,
//     isLoading,
//     isSuccess,
//   } = useGetTermsAndConditionsQuery({});
//   const [setTermsAndConditions, { isLoading: isSaving }] =
//     useSetTermsAndConditionsMutation();

//   // Initialize Quill once
//   useEffect(() => {
//     const loadQuill = async () => {
//       const Quill = (await import("quill")).default;

//       if (
//         editorRef.current &&
//         !editorRef.current.classList.contains("ql-container")
//       ) {
//         const quill = new Quill(editorRef.current, {
//           theme: "snow",
//           placeholder: "Enter your Terms and Conditions...",
//         });

//         quillRef.current = quill;

//         quill.on("text-change", () => {
//           const html = quill.root.innerHTML;
//           setContent(html);
//         });
//       }
//     };

//     if (typeof window !== "undefined") {
//       loadQuill();
//     }
//   }, []);

//   // Paste fetched terms into editor once available
//   useEffect(() => {
//     if (terms?.description && quillRef.current) {
//       quillRef.current.clipboard.dangerouslyPasteHTML(terms.description);
//       setContent(terms.description); // sync initial state
//     }
//   }, [terms]);

//   const handleSubmit = async () => {
//     try {
//       const res = await setTermsAndConditions({
//         description: content,
//       }).unwrap();
//       alert("Terms and Conditions saved successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save.");
//     }
//   };

//   return (
//     <div className='min-h-[75vh] w-[96%] mx-auto flex flex-col justify-between gap-6'>
//       <div className='space-y-6'>
//         <div className='h-auto'>
//           <div
//             ref={editorRef}
//             id='editor'
//             className='h-[50vh] bg-white text-base'
//           />
//         </div>
//       </div>

//       <div className='flex justify-end'>
//         <Button
//           onClick={handleSubmit}
//           disabled={isSaving}
//           className='bg-primary hover:bg-teal-700'
//         >
//           {isSaving ? "Saving..." : "Save Content"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default EditAboutUs;

// ---------------------------------------------------------------------------------------------------------------------------

"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  useGetTermsAndConditionsQuery,
  useSetTermsAndConditionsMutation,
} from "@/redux/feature/settingAPI";
import Loading from "@/components/loading/Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EditAboutUs = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const { data: terms, isLoading } = useGetTermsAndConditionsQuery({});

  const [setTermsAndConditions, { isLoading: isSaving }] =
    useSetTermsAndConditionsMutation();

  useEffect(() => {
    let initialized = false;

    const init = async () => {
      if (initialized || quillRef.current) return;
      initialized = true;

      const Quill = (await import("quill")).default;

      if (editorRef.current && !editorRef.current.querySelector(".ql-editor")) {
        const quill = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Enter your Terms and Conditions...",
        });

        quillRef.current = quill;

        if (terms?.description) {
          quill.root.innerHTML = terms.description;
          setContent(terms.description);
        }

        quill.on("text-change", () => {
          setContent(quill.root.innerHTML);
        });
      }
    };

    if (typeof window !== "undefined") {
      init();
    }

    return () => {
      initialized = true;
    };
  }, [terms]);

  if (isLoading && !terms && !quillRef.current) return <Loading />;

  const handleSubmit = async () => {
    try {
      const res =await setTermsAndConditions({ description: content }).unwrap();
      if (res?.description) {
        toast.success("Terms and Conditions saved successfully!");
        router.push("/setting/terms-condition");
      } else {
        toast.error("Failed to save.");
      }
    } catch {
      toast.error("Save failed.");
    }
  };

  return (
    <div className='min-h-[75vh] w-[96%] mx-auto flex flex-col justify-between gap-6'>
      <div className='space-y-6'>
        <div className='h-auto'>
          <div
            ref={editorRef}
            className='h-[50vh] bg-white text-base'
            id='quill-editor'
          />
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className='bg-primary hover:bg-teal-700'
        >
          {isSaving ? "Saving..." : "Save Content"}
        </Button>
      </div>
    </div>
  );
};

export default EditAboutUs;

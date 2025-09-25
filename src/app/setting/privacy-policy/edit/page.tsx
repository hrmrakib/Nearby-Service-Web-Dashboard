"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  useGetPrivacyPolicyQuery,
  useSetPrivacyPolicyMutation,
  useSetTermsAndConditionsMutation,
} from "@/redux/feature/settingAPI";
import Loading from "@/components/loading/Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EditPrivacyPolicy = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const {
    data: privacyPolicy,
    isLoading,
    refetch,
  } = useGetPrivacyPolicyQuery({});

  const [setPrivacyPolicy, { isLoading: isSaving }] =
    useSetPrivacyPolicyMutation();

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

        if (privacyPolicy?.description) {
          quill.root.innerHTML = privacyPolicy.description;
          setContent(privacyPolicy.description);
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
  }, [privacyPolicy]);

  if (isLoading && !privacyPolicy && !quillRef.current) return <Loading />;

  const handleSubmit = async () => {
    try {
      const res = await setPrivacyPolicy({ description: content }).unwrap();
      if (res?.description) {
        toast.success("Terms and Conditions saved successfully!");
        router.push("/setting/privacy-policy");
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

export default EditPrivacyPolicy;

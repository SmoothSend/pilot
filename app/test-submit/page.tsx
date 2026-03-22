"use client";

import { submitApplication } from "@/app/actions";
import { useState } from "react";

export default function TestSubmitPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleTestSubmit = async () => {
    setLoading(true);
    setResult("Submitting...");

    const testData = {
      project_name: "Debug Test Project",
      website_url: "https://debugtest.xyz",
      twitter_url: "https://x.com/debugtest",
      one_liner: "Testing RLS policy fix with debug button for Supabase application submissions",
      mainnet_status: "live" as const,
      daily_txs: "1000+" as const,
      gas_solution: "users_pay" as const,
      why_gasless: "Testing the complete RLS setup with proper anon key authentication. This should work now with the fixed policy that explicitly targets the anon role.",
      email: "debug@test.xyz",
      telegram: "debugtest",
      data_agreement: true,
    };

    try {
      const response = await submitApplication(testData);
      
      if (response.success) {
        setResult(`✅ Success! Application ID: ${response.id}`);
      } else {
        setResult(`❌ Error: ${response.error}`);
      }
    } catch (error) {
      setResult(`❌ Exception: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Debug: Test Application Submission
        </h1>
        
        <button
          onClick={handleTestSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? "Submitting..." : "Test Submit Application"}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-mono whitespace-pre-wrap">{result}</p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">Current Setup:</p>
          <ul className="space-y-1 text-xs">
            <li>✅ Using NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>✅ RLS policy: anon role can INSERT</li>
            <li>✅ Server client configured correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

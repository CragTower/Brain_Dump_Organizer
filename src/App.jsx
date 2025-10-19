import { useState } from 'react';
import DumpInput from './components/DumpInput';
import { organizeThoughts } from './services/claudeAPI';

function App() {
    const [dumpText, setDumpText] = useState('');
    const [organizedText, setOrganizedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const handleOrganize = async () => {
        if (!dumpText.trim()) {
            setError('Please enter some thoughts!')
            return;
        }

        setIsLoading(true);
        setError('');
        setOrganizedText('');

        try {
            const result = await organizeThoughts(dumpText);
            setOrganizedText(result);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setDumpText('');
        setOrganizedText('');
        setError('');
        setCopySuccess(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(organizedText);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            setError('Failed to copy to clipboard.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Brain Dump Organizer
                </h1>
                <p className="text-gray-600 mb-8">
                    AI-powered thought organizer for ADD brains
                </p>

                <div className="bg-white rounded-lg shadow p-6">
                    <DumpInput value={ dumpText } onChange={ setDumpText } />

                    { error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            { error }
                        </div>
                    ) }

                    <div className="flex gap-3">
                        <button
                            onClick={ handleOrganize }
                            disabled={ isLoading || !dumpText.trim() }
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Organizing...
                                </span>
                            ) : (
                                'Organize My Thoughts'
                            )}
                        </button>

                        <button
                            onClick={handleClear}
                            disabled={isLoading}
                            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {organizedText && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Organized Thoughts
                            </h2>
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                                {copySuccess ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                        </svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="prose max-w-none whitespace-pre-wrap text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            {organizedText}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
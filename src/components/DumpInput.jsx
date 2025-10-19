function DumpInput({ value, onChange }) {
    return (
        <div className="mb-6">
            <label htmlFor="dump" className="block text-sm font-medium text-gray-700 mb-2">
                Dump your thoughts here
            </label>
            <textarea
                id="dump"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Just start typing... doesn't have to be organized, just dump everything on your mind."
            />
            <p className="text-sm text-gray-500 mt-2">
                {value.length} characters
            </p>
        </div>
    );
}

export default DumpInput;
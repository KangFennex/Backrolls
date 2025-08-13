import "./logo.scss";

export default function Logo() {
    return (
        <p className="logo text-5xl flex items-center justify-center h-full">
            <span className="block md:hidden mt-2">B.</span>
            <span className="hidden md:block">Backrolls</span>
        </p>
    );
};
function Loading() {
  return (
    <div className="h-screen flex justify-center items-center animate-pulse">
      {/* url quote is malformed in the original class string - kept as-is for pixel parity (Tailwind ignores it, so no background shows) */}
      <div className="bg-[url('/images/RMHS.jpg)] w-20 h-20 rounded-full bg-cover bg-center max-md:w-16 max-md:h-16 max-sm:w-12 max-sm:h-12">
        {/* <Image src="" width={50} height={50} className="rounded-full" /> */}
      </div>
    </div>
  );
}

export default Loading;

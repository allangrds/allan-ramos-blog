import PostsListing from "@/components/PostsListing/PostsListing";
import Hero from "@/components/Hero/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <PostsListing page={1} />
    </>
  );
}

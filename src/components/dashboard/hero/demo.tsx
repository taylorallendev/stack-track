"use client";

import Link from "next/link";
import { LayoutGroup, motion } from "framer-motion";
import Floating, { FloatingElement } from "./parallax-floating";
import { TextRotate } from "~/components/ui/text-rotate";

interface ExampleImage {
  url: string;
  author: string;
  title: string;
  link?: string;
}

const exampleImages = [
  {
    url: "https://images.unsplash.com/photo-1727341554370-80e0fe9ad082?q=80&w=2276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Branislav Rodman",
    title: "A Black and White Photo of a Woman Brushing Her Teeth",
  },
  {
    url: "https://images.unsplash.com/photo-1640680608781-2e4199dd1579?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/photos/a-painting-of-a-palm-leaf-on-a-multicolored-background-AaNPwrSNOFE",
    title: "Neon Palm",
    author: "Tim Mossholder",
  },
  {
    url: "https://images.unsplash.com/photo-1726083085160-feeb4e1e5b00?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/photos/a-blurry-photo-of-a-crowd-of-people-UgbxzloNGsc",
    author: "ANDRII SOLOK",
    title: "A blurry photo of a crowd of people",
  },
  {
    url: "https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=2838&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/photos/rippling-crystal-blue-water-9-OCsKoyQlk",
    author: "Wesley Tingey",
    title: "Rippling Crystal Blue Water",
  },
  {
    url: "https://images.unsplash.com/photo-1624344965199-ed40391d20f2?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/de/fotos/mann-im-schwarzen-hemd-unter-blauem-himmel-m8RDNiuEXro",
    author: "Serhii Tyaglovsky",
    title: "Mann im schwarzen Hemd unter blauem Himmel",
  },
  {
    url: "https://images.unsplash.com/photo-1689553079282-45df1b35741b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/photos/a-woman-with-a-flower-crown-on-her-head-0S3muIttbsY",
    author: "Vladimir Yelizarov",
    title: "A women with a flower crown on her head",
  },
  {
    url: "https://images.unsplash.com/photo-1721968317938-cf8c60fccd1a?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "A blurry photo of white flowers in a field",
    author: "Eugene Golovesov",
    link: "https://unsplash.com/photos/a-blurry-photo-of-white-flowers-in-a-field-6qbx0lzGPyc",
  },
  {
    url: "https://images.unsplash.com/photo-1677338354108-223e807fb1bd?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mathilde Langevin",
    link: "https://unsplash.com/photos/a-table-topped-with-two-wine-glasses-and-plates-Ig0gRAHspV0",
    title: "A table topped with two wine glasses and plates",
  },
] as const satisfies ExampleImage[];

function LandingHero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden md:overflow-visible">
      <Floating sensitivity={-0.5} className="h-full">
        <FloatingElement
          depth={0.5}
          className="left-[2%] top-[15%] md:left-[5%] md:top-[25%]"
        >
          <motion.img
            src={exampleImages[0].url}
            alt={exampleImages[0].title}
            className="h-12 w-16 -rotate-[3deg] cursor-pointer rounded-xl object-cover shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-16 sm:w-24 md:h-20 md:w-28 lg:h-24 lg:w-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </FloatingElement>

        <FloatingElement
          depth={1}
          className="left-[8%] top-[0%] md:left-[11%] md:top-[6%]"
        >
          <motion.img
            src={exampleImages[1].url}
            alt={exampleImages[1].title}
            className="h-28 w-40 -rotate-12 cursor-pointer rounded-xl object-cover shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-36 sm:w-48 md:h-44 md:w-56 lg:h-48 lg:w-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          />
        </FloatingElement>

        <FloatingElement
          depth={4}
          className="left-[6%] top-[90%] md:left-[8%] md:top-[80%]"
        >
          <motion.img
            src={exampleImages[2].url}
            alt={exampleImages[2].title}
            className="h-40 w-40 -rotate-[4deg] cursor-pointer rounded-xl object-cover shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-48 sm:w-48 md:h-60 md:w-60 lg:h-64 lg:w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          />
        </FloatingElement>

        <FloatingElement
          depth={2}
          className="left-[87%] top-[0%] md:left-[83%] md:top-[2%]"
        >
          <motion.img
            src={exampleImages[3].url}
            alt={exampleImages[3].title}
            className="h-36 w-40 rotate-[6deg] cursor-pointer rounded-xl object-cover shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-44 sm:w-48 md:h-52 md:w-60 lg:h-56 lg:w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          />
        </FloatingElement>

        <FloatingElement
          depth={1}
          className="left-[83%] top-[78%] md:left-[83%] md:top-[68%]"
        >
          <motion.img
            src={exampleImages[4].url}
            alt={exampleImages[4].title}
            className="h-44 w-44 rotate-[19deg] cursor-pointer rounded-xl object-cover shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          />
        </FloatingElement>
      </Floating>

      <div className="pointer-events-auto z-50 flex w-[250px] flex-col items-center justify-center sm:w-[300px] md:w-[500px] lg:w-[700px]">
        <motion.h1
          className="font-calendas flex w-full flex-col items-center justify-center space-y-1 whitespace-pre text-center text-3xl leading-tight tracking-tight sm:text-5xl md:space-y-4 md:text-7xl lg:text-8xl"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
        >
          <span>Make your </span>
          <LayoutGroup>
            <motion.span layout className="flex whitespace-pre">
              <motion.span
                layout
                className="flex whitespace-pre"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                website{" "}
              </motion.span>
              <TextRotate
                texts={[
                  "fancy",
                  "fun",
                  "lovely ♥",
                  "weird",
                  "🪩 funky",
                  "💃🕺",
                  "sexy",
                  "🕶️ cool",
                  "go 🚀",
                  "🔥🔥🔥",
                  "over-animated?",
                  "pop ✨",
                  "rock 🤘",
                ]}
                mainClassName="overflow-hidden pr-3 text-[#0015ff] py-0 pb-2 md:pb-4 rounded-xl"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>
        <motion.p
          className="font-overusedGrotesk pt-4 text-center text-sm sm:pt-8 sm:text-lg md:pt-10 md:text-xl lg:pt-12 lg:text-2xl"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
        >
          with a growing library of ready-to-use react components &
          microinteractions. free & open source.
        </motion.p>

        <div className="mt-10 flex flex-row items-center justify-center space-x-4 text-xs sm:mt-16 md:mt-20 lg:mt-20">
          <motion.button
            className="font-calendas z-20 rounded-full bg-foreground px-4 py-2 font-semibold tracking-tight text-background shadow-2xl sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-lg lg:px-8 lg:py-3 lg:text-xl"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: 0.7,
              scale: { duration: 0.2 },
            }}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", damping: 30, stiffness: 400 },
            }}
          >
            <Link href="/docs/introduction">
              Check docs <span className="ml-1 font-serif">→</span>
            </Link>
          </motion.button>
          <motion.button
            className="font-calendas z-20 rounded-full bg-[#0015ff] px-4 py-2 font-semibold tracking-tight text-white shadow-2xl sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-lg lg:px-8 lg:py-3 lg:text-xl"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: 0.7,
              scale: { duration: 0.2 },
            }}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", damping: 30, stiffness: 400 },
            }}
          >
            <Link href="https://github.com/danielpetho/fancy">★ on GitHub</Link>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

export { LandingHero };

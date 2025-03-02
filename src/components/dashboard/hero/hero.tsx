import { motion, LayoutGroup } from "framer-motion";
import { TextRotate } from "~/components/ui/text-rotate";
import Floating, { FloatingElement } from "./parallax-floating";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-start overflow-hidden pt-16 md:overflow-visible">
      <Floating sensitivity={-0.5} className="h-full">
        {/* Replace with poker-related images */}
        <FloatingElement
          depth={0.5}
          className="left-[2%] top-[15%] md:left-[5%] md:top-[25%]"
        >
          <motion.img
            src="/images/poker-chips.jpg"
            alt="Stack of poker chips"
            className="h-12 w-16 -rotate-[3deg] cursor-pointer rounded-xl object-cover shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-16 sm:w-24 md:h-20 md:w-28 lg:h-24 lg:w-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </FloatingElement>

        {/* Add more FloatingElements with poker images */}
      </Floating>

      <div className="pointer-events-auto z-50 mt-8 flex w-[250px] flex-col items-center sm:mt-10 sm:w-[300px] md:mt-12 md:w-[500px] lg:mt-14 lg:w-[700px]">
        <motion.h1
          className="flex w-full flex-col items-center justify-center space-y-1 whitespace-pre text-center text-3xl leading-tight tracking-tight sm:text-5xl md:space-y-4 md:text-7xl lg:text-8xl"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
        >
          <span className="font-mono">Track your </span>
          <LayoutGroup>
            <motion.span layout className="flex whitespace-pre">
              <motion.span
                layout
                className="flex whitespace-pre font-mono"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                poker game{" "}
              </motion.span>
              <TextRotate
                texts={[
                  "precisely",
                  "strategically",
                  "intelligently",
                  "confidently",
                  "profitably",
                  "instantly",
                  "visually",
                ]}
                mainClassName="overflow-hidden pr-3 text-primary py-0 pb-2 md:pb-4 rounded-xl font-mono whitespace-nowrap"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>
        <motion.p
          className="pt-4 text-center font-mono text-sm font-normal text-muted-foreground sm:pt-8 sm:text-lg md:pt-10 md:text-xl lg:pt-12 lg:text-2xl"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
        >
          Analyze your performance, track your bankroll, and improve your game
          with detailed statistics and insights.
        </motion.p>

        <div className="mt-10 flex flex-row items-center justify-center space-x-4 text-xs sm:mt-16 md:mt-20 lg:mt-20">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: 0.7,
            }}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", damping: 30, stiffness: 400 },
            }}
          >
            <Button asChild size="lg">
              <Link href="/dashboard">
                Get Started <span className="ml-1">→</span>
              </Link>
            </Button>
          </motion.div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: 0.7,
            }}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", damping: 30, stiffness: 400 },
            }}
          >
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

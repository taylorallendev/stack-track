import { motion, LayoutGroup } from "framer-motion";
import { TextRotate } from "~/components/ui/text-rotate";
import Floating, { FloatingElement } from "./parallax-floating";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { AceClubs, AceDiamonds, AceHearts, AceSpades } from "./cards";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-start overflow-hidden pt-16 md:overflow-visible">
      <Floating sensitivity={-0.5} className="h-full">
        <FloatingElement
          depth={0.5}
          className="left-[2%] top-[15%] md:left-[5%] md:top-[25%]"
        >
          <motion.div
            className="h-12 w-16 -rotate-[3deg] cursor-pointer rounded-xl shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-16 sm:w-24 md:h-20 md:w-28 lg:h-24 lg:w-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AceHearts />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={1}
          className="left-[8%] top-[0%] md:left-[11%] md:top-[6%]"
        >
          <motion.div
            className="h-21 w-30 sm:h-27 md:h-33 md:w-42 lg:w-45 -rotate-12 cursor-pointer rounded-xl shadow-2xl transition-transform duration-200 hover:scale-105 sm:w-36 lg:h-36"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <AceSpades />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={4}
          className="left-[6%] top-[90%] md:left-[8%] md:top-[80%]"
        >
          <motion.div
            className="h-40 w-40 -rotate-[4deg] cursor-pointer rounded-xl shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-48 sm:w-48 md:h-60 md:w-60 lg:h-64 lg:w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <AceDiamonds />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={2}
          className="left-[87%] top-[0%] md:left-[83%] md:top-[2%]"
        >
          <motion.div
            className="h-36 w-40 rotate-[6deg] cursor-pointer rounded-xl shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-44 sm:w-48 md:h-52 md:w-60 lg:h-56 lg:w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <AceClubs />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={1}
          className="left-[83%] top-[78%] md:left-[83%] md:top-[68%]"
        >
          <motion.div
            className="h-35 w-35 sm:h-51 sm:w-51 md:h-58 md:w-58 rotate-[19deg] cursor-pointer rounded-xl shadow-2xl transition-transform duration-200 hover:scale-105 lg:h-64 lg:w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <AceHearts />
          </motion.div>
        </FloatingElement>
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

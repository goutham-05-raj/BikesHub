import { useRef, CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

function AnimatedChar({
  char,
  index,
  total,
  scrollYProgress,
}: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      {/* Invisible placeholder reserves space */}
      <span style={{ opacity: 0, userSelect: 'none' }}>{char}</span>
      {/* Animated overlay */}
      <motion.span
        style={{
          opacity,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {characters.map((char, i) => (
        <AnimatedChar
          key={i}
          char={char}
          index={i}
          total={characters.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
}

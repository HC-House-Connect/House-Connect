import { ReactNode, RefObject, useEffect, useRef } from 'react';

import Container from '@/components/atoms/Container';
import cn from '@/libs/cn';

type CarouselProps = {
  // eslint-disable-next-line react/require-default-props
  className?: string;
  children: ReactNode;
  order: number;
  containerRef: RefObject<HTMLDivElement>;
};

export default function Carousel(props: CarouselProps) {
  const { className, children, order, containerRef } = props;
  const translateX = `-translate-x-[${order * 100}%]`;

  return (
    <Container.FlexRow
      className={cn('w-full overflow-hidden overflow-y-scroll', className)}
    >
      <Container.FlexRow
        className={cn('w-full transition', translateX)}
        ref={containerRef}
      >
        {children}
      </Container.FlexRow>
    </Container.FlexRow>
  );
}

Carousel.NonFocusable = function CarouselNonFocusable(
  props: Omit<CarouselProps, 'containerRef'>,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carouselChildrenList = containerRef.current?.querySelectorAll('*');
    carouselChildrenList?.forEach(element =>
      element.setAttribute('tabindex', '-1'),
    );
  }, []);

  return <Carousel {...props} containerRef={containerRef} />;
};

Carousel.Focusable = function CarouselFocusable(
  props: Omit<CarouselProps, 'containerRef'>,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    };

    document.addEventListener('focusin', handleFocus);
  }, []);

  return <Carousel {...props} containerRef={containerRef} />;
};

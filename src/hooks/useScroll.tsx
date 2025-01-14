/**
 * ScrollTopOptions 속성
 * behavior : 'auto' | 'smooth'
 * block: 'start' | 'center' | 'end' | 'nearest'
 * inline: 'start' | 'center' | 'end' | 'nearest'
 */

type ScrollToOptions = {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
};

/**
 * ScrollToProps
 * ref: window 스크롤 구현시 의도적으로 null값을 전달해주세요.
 */

type ScrollToProps = {
  ref: React.RefObject<HTMLElement> | null;
  top?: number;
  options?: ScrollToOptions;
};

const useScrollTo = ({ ref, top, options }: ScrollToProps) => {
  const scrollTo = () => {
    if (!ref && top !== undefined) {
      window.scrollTo({
        top,
        behavior: options?.behavior || 'smooth',
      });
      return;
    }

    if (ref?.current) {
      if (top !== undefined) {
        ref.current.scrollTo({
          top,
          behavior: options?.behavior || 'smooth',
        });
        return;
      }

      if (top === undefined) {
        ref.current.scrollIntoView({
          behavior: options?.behavior || 'smooth',
          block: options?.block || 'start',
          inline: options?.inline,
        });
      }
    }
  };

  return scrollTo;
};

export default useScrollTo;
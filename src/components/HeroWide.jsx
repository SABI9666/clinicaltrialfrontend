import Image from './Image.jsx';

export default function HeroWide({ heroWide }) {
  if (!heroWide?.image?.src) return null;
  return (
    <figure className="hero-wide">
      <Image image={heroWide.image} />
    </figure>
  );
}

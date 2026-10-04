import { profile } from '../data/profile';

export default function ResumeButton({ children = 'Resume', className = 'button button-outline' }: { children?: string; className?: string }) {
  return <a className={className} href={profile.resume} target="_blank" rel="noopener noreferrer">{children}</a>;
}

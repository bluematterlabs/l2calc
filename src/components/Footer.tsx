import { SiGithub, SiTwitter } from 'react-icons/si'

const gitHubUrl = 'https://github.com/bluematterlabs'
const twitterUrl = 'https://twitter.com/bluesweep_xyz'

const Footer: React.FC = () => {
  return (
    <div className="text-sm font-bold text-white/70">
      Made with 💙 by <a href="https://bluesweep.xyz">bluesweep.xyz</a>
      {/* social icons */}
      <div className="mt-3 flex gap-4 items-center justify-center opacity-75">
        <a href={gitHubUrl} target="_blank" rel="noreferrer">
          <div className="cursor-pointer transition-colors text-slate-500 hover:text-slate-500/75">
            <SiGithub className="text-xl" />
          </div>
        </a>

        <a href={twitterUrl} target="_blank" rel="noreferrer">
          <div className="cursor-pointer transition-colors text-slate-500 hover:text-slate-500/75">
            <SiTwitter className="text-xl" />
          </div>
        </a>
      </div>
    </div>
  )
}

export default Footer

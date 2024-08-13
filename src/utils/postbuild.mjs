import { program } from 'commander'
import { writeFileSync } from 'fs'
import { getLastCommit } from 'git-last-commit'
import dateFormat from 'dateformat'

program
  .option('-r, --relevance <type>', 'Relevance time of front', 'blue')

program.parse(process.argv)

const options = program.opts()

if (options.relevance) {
  getLastCommit(function (_err, commit) {
    if (!commit) {
      return
    }
    const commitDate = dateFormat(new Date(parseInt(commit.committedOn) * 1000), 'yyyy-mm-dd')
    const buildDate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM')
    if (!_err) {
      const content = JSON.stringify({
        relevance: `${process.env.npm_package_version}-commit:${commit.shortHash}!${commit.branch}!${commitDate}-build:${process.env.COMPUTERNAME}!${buildDate}`
      })

      writeFileSync(
        options.relevance,
        content,
        {
          flag: 'w'
        }
      )
    }
  })
}

.PHONY: _push build clean cr doc eslint jscpd npm_publish push qa serve test tsc update

_push: qa
	git checkout --orphan new_master
	git add      --all
	git commit   --message='nnn'
	git branch   --force --delete master
	git branch   --move           master
	git push     --force  origin  master
	git gc       --force

build:
	bun build ./src/nnn/nnn.ts --outdir=dist --bundle

clean:
	rm -rf d.ts

cr: eslint jscpd tsc

doc: tsc
	bun src/doc.ts

eslint: clean
	bun x eslint --fix data src test

jscpd: clean
	bun x jscpd src test --threshold 0 --gitignore

npm_publish: qa
	cd dist/ ; PATH="$$HOME/.volta/bin:$$PATH" npm publish --access public

push: qa
	git add    --all
	git commit --message=nnn
	git push   --force origin master

qa: cr doc build test

serve:
	bun -e 'import { serve } from "./src/serve.js" ; serve(12345)'

test:
	bun test

tsc: clean
	bun x tsc

update:
	bun x ncu -u

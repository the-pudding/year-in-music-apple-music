PHONY: github aws-assets aws-htmljs aws-cache pudding client

github:
	rm -rf docs
	cp -r dist/ docs
	git add -A
	git commit -m "update dev version"
	git push

archive:
	zip -r archive.zip dev
	git add -A
	git commit -m "archive"
	git push

client:
	npm run depudding

aws-assets:
	aws s3 sync dist s3://pudding.cool/2021/10/judge-my-music --delete --cache-control 'max-age=31536000' --exclude 'index.html' --exclude 'bundle.js'

aws-htmljs:
	aws s3 cp dist/index.html s3://pudding.cool/2021/10/judge-my-music/index.html
	aws s3 cp dist/bundle.js s3://pudding.cool/2021/10/judge-my-music/bundle.js

aws-cache:
	aws cloudfront create-invalidation --distribution-id E13X38CRR4E04D --paths '/2021/10/judge-my-music*'

pudding: aws-assets aws-htmljs aws-cache archive

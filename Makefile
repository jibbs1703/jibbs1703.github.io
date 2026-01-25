.PHONY: add commit push

add:
	git add .

commit: add
	git commit -m "$(msg)"

push: commit
	git push
	clear
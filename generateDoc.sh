#!/bin/sh

if [ "$1" = "-h" ]; then
	echo 'generateDoc.sh Generates the document in public/apidoc/'
	echo ''
	echo 'Usage:'
	echo '\t./generateDoc.sh'
	echo 'options:'
	echo '\t-p\t to generate private functions'
	echo '\t-d\t to set debug option'
	return 0
fi

for arg in $@; do
	case $arg in
		# '-p')
		# 	args=$args' --private true'
		# 	;;
		'-d')
			args=$args' --debug'
			;;
		'-v')
			args=$args' --verbose'
			;;
		*)
			echo 'unrecognized argument '$arg
	esac
done
echo $args

apidoc -e ./node_modules -e ./public -o public/apidoc/ -i ./ $args --private true
# add --private true/false to export or not private, default does

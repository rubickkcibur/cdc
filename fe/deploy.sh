rm -rf out 
yarn next build
yarn next export
VERSION=$(git describe --always)
TAG1=192.168.1.149:5001/act/kashv:${VERSION}
docker build -t act/kashv2:${VERSION}   .
docker tag act/kashv2:${VERSION} ${TAG1}
docker push ${TAG1}
ssh bridge-super "docker rm -f kashv ; docker run -p 4892:80 --name kashv -d localhost:5001/act/kashv:${VERSION}"




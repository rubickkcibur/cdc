# Smart Epidemiological Investigation Platform (Demo)
SmartEIP is an AI-empowered platform for the epidemiological investigation. Leveraging the maximal clique algorithm, prevalent multi-hop reasoning model, and computer visualization techniques, SmartEIP provides strong assistance to epidemiologists in conducting an epidemiological investigation. 

For now, the demo version of SmartEIP includes complete client side and server side, while the AI part is under implementing. It has been deployed to multiple outbreaks in China and gets highly appreciated by professionals. 

To run the client side, use [yarn](https://yarnpkg.com/):
```
cd fe
yarn
yarn next build
yarn next start
```
you may be troubled with following error message:
> ./node_modules/@antv/g6-pc/es/graph/controller/layout.js
> Attempted import error: 'LayoutWorker' is not exported from '../../layout/worker/layout.worker'.

Please remove the curly brackets of `import { LayoutWorker }` in fe/node_modules/@antv/g6-pc/es/graph/controller/layout.js:6

To run the server side, use [python](https://www.python.org/)
```
cd lc/django_app
python3 manage.py runserver <ip>:<port>
```
you should deploy mysql, create your user account, and migrate tables settings



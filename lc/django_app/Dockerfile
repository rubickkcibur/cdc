FROM python:3.7
ENV PYTHONUNBUFFERED 1

# 添加这两行
RUN apt-get update
RUN apt-get install python3-dev default-libmysqlclient-dev -y

RUN mkdir /code
WORKDIR /code
RUN pip install pip -U
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/

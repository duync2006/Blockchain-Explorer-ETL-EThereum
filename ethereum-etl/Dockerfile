FROM python:3.7
ENV PROJECT_DIR=ethereum-etl

RUN mkdir /$PROJECT_DIR
WORKDIR /$PROJECT_DIR
COPY requirement.txt .
COPY . .
RUN pip install --upgrade pip && pip install -e /$PROJECT_DIR/[streaming] 
RUN pip install -r requirement.txt

# # Add Tini
# ENV TINI_VERSION v0.18.0
# ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
# RUN chmod +x /tini
# ENTRYPOINT ["/tini", "--", "python", "ethereumetl"]

EXPOSE 5000

CMD [ "python", "main.py" ]


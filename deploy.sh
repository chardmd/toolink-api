#!/bin/bash

if [ $TRAVIS_BRANCH == 'dev' ]; 
    then 
        sls deploy;
    else 
        sls deploy --stage production;
fi
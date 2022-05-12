#!/bin/bash

ASG_NAME="WallStreet-WebServerAsg"
echo "Identifying ASG $ASG_NAME current capacity"
region="us-west-2"
desired_size=`aws autoscaling describe-auto-scaling-groups --auto-scaling-group-name $ASG_NAME --region $region --query 'AutoScalingGroups[].[DesiredCapacity]' --output text`
min_size=`aws autoscaling describe-auto-scaling-groups --auto-scaling-group-name $ASG_NAME --region $region --query 'AutoScalingGroups[].[MinSize]' --output text`
max_size=`aws autoscaling describe-auto-scaling-groups --auto-scaling-group-name $ASG_NAME --region $region --query 'AutoScalingGroups[].[MaxSize]' --output text`

echo "Min Size: $min_size"
echo "Max Size: $max_size"
echo "Desired Size: $desired_size"

# Set ASG desired capacity above to 0
echo "Setting the values for ASG capacity to 0, and starting app upgrade with latest app image $ASG_NAME"
aws autoscaling update-auto-scaling-group \
    --region us-west-2 \
    --auto-scaling-group-name WallStreet-WebServerAsg \
    --min-size 0 \
    --max-size 0 \
    --desired-capacity 0

# Set ASG Desired capacity above to $WallStreet-WebServerAsg
sleep 300
echo "Setting the value to desired capacity again to MinSize $min_size MaxSize $max_size DesiredSize $desired_size"
aws autoscaling update-auto-scaling-group \
    --region us-west-2 \
    --auto-scaling-group-name WallStreet-WebServerAsg \
    --min-size $min_size \
    --max-size  $max_size\
    --desired-capacity $desired_size



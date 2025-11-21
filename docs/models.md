## users 
id
clerk_id
email
full_name
role
created_at

## players
user
city
favorite_sport
level
position

## tournament
id
name
sport
city
start_date
organizer
created_at

## teams
id
name
tournament
max_capacity
current_capacity
members
created_at

## joinrequest
STATUS_CHOICES
id
player
team
status
message
created_at
updated_at

## matches 
id
team_a
team_b
date
location
score_a
score_b
created_at


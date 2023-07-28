from Backend.models import Item, VisitationLog, UserProfile, User, Bid, Message
from ..MatrixFactorization import MatrixFactorization
from datetime import datetime, timedelta


def createMatrix():

    userVisitLogs = []
    usersItems = []
    
    for user in UserProfile.objects.all().values():
        if not (User.objects.get(id=user['user_id_id']).is_superuser):
            
            for item in Item.objects.filter().values():
                visitLog = VisitationLog.objects.filter(user_id=user['id'], item_id=item['id'])
                
                if not(visitLog.exists()):
                    userVisitLogs.append({
                        "user_id"           :   user['id'],
                        "item_id"           :   item['id'],
                        "count"             :   0,
                        "recommendation"    :   None   
                    })
                else:
                    visitLog = VisitationLog.objects.filter(user_id=user['id'], item_id=item['id']).values()[0]
                    
                    userVisitLogs.append({
                        "user_id"           :   visitLog['user_id_id'],
                        "item_id"           :   visitLog['item_id_id'],
                        "count"             :   visitLog['count'],
                        "recommendation"    :   visitLog['recommendation']   
                    })

            usersItems.append(userVisitLogs)


def FindTopRecommendations(users_items):

    rec_list = []
    
    for i in range(len(users_items)):   
            rec_list.append(sorted(list(users_items[i]), key=lambda x: x["recommendation"], reverse=True))

        
    return [rec_list[i][0:18] for i in range(0, len(rec_list))]


def updateDBLogs(users_items):

    for user_logs in users_items:
        for log in user_logs:

            try:
                vlog = VisitationLog.objects.get(user_id_id=log["user_id"], item_id_id=log["item_id"])
                vlog.recommendation = log["recommendation"]
                vlog.save()

            except VisitationLog.DoesNotExist:
                VisitationLog.objects.create(user_id_id=log["user_id"], item_id_id=log["item_id"], count=log["count"], recommendation=log["recommendation"])


def recom_system():

    createMatrix()
    
    mf = MatrixFactorization()
    factorizedUserItems = mf.begin()

    factorizedUserItems = FindTopRecommendations(factorizedUserItems)

    updateDBLogs(factorizedUserItems)


def delete_auctions():
    Item.objects.filter(active=False, ends__lte = datetime.now() - timedelta(days=3)).delete()


def disable_auctions():
    expired_auctions = Item.objects.filter(active=True, ends__lte = datetime.now())
    
    for auction in expired_auctions:
        bids = Bid.objects.filter(item=auction.id).order_by(('-time'))
        message = f"""
        -- Automated message --
        Congratulation on winning the {auction.name} auction.
        In order to communicate with the seller compose a new message.
        """

        Message.objects.create(message=message, time=datetime.now().replace(second=0, microsecond=0), receiver_id_id=bids[0].bidder_user_id, 
                                sender_id_id=auction.seller_user_id, 
                                subject=f"You Won The Auction Named {auction.name}")
                            
    expired_auctions.update(active=False)
    print(str(expired_auctions) + " " + str(datetime.now()))


def enable_auctions():
    Item.objects.filter(active=False, started__lte = datetime.now(), ends__gte = datetime.now()).update(active=True)

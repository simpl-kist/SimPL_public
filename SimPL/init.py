import os
import subprocess
import requests
import json
import sys
import pymysql

##########################################################################
#
#   python3 init.py [username] [remocon address]
#   python3 init.py simpl http://172.17.0.1:5001 # for remocon
#   python3 init.py # for local container only
#
##########################################################################

user = "None"
remocon_url = "http://172.17.0.1:5001"
if len(sys.argv)>1:
  user = sys.argv[1]
if len(sys.argv)>2:
  remocon_url = sys.argv[2]
  if "://" not in remocon_url:
    print("Wrong address (example = http://172.17.0.1:5001")
    remocon_url = "http://172.17.0.1:5001"
print("Username = "+user)
print("Remocon url = "+remocon_url)
def register(username, remocon_url):
  subprocess.check_output("/etc/init.d/mysql restart", shell=True)
  key = ""
  if username != "None":
    try:
      ret=requests.post(url=remocon_url+"/user/register", json={"user":username})
      print(ret.text)
      ret = json.loads(ret.text)
      if ret["status"] != "fail":
        ret = ret["message"]
        key = ret[2]
        f=open("/etc/passwd","r")
        usrlist = f.readlines()
        for i in range(len(usrlist)):
          user = usrlist[i].split(":")
          if user[0] == "SimPL":
            user[2] = ret[0]
            user[3] = ret[1]
            usrlist[i] = ":".join(user)
        f.close()
        usrlist = "".join(usrlist)
        f=open("/etc/passwd","w")
        f.write(usrlist)
        f.close()
#user
        f=open("/etc/group","r")
        grplist = f.readlines()
        for i in range(len(grplist)):
          group = grplist[i].split(":")
          if group[0] == "SimPL":
            group[2] = ret[1]
            grplist[i] = ":".join(group)
        grplist = "".join(grplist)
        f.close()
        f=open("/etc/group","w")
        f.write(grplist)
        f.close()
#group
    except:
      pass
  subprocess.check_output("/etc/init.d/apache2 restart", shell=True)
  subprocess.check_output("chown SimPL.SimPL /var/www/SimPL/ -R", shell=True)
  if not os.path.isdir("/data/jobs"):
    subprocess.check_output("mkdir /data/jobs", shell=True)
  subprocess.check_output("chown SimPL.SimPL /data/jobs/ -R", shell=True)
  if not os.path.isdir("/data/SimPL"):
    subprocess.check_output("mkdir /data/SimPL", shell=True)
  if not os.path.isdir("/data/repos"):
    subprocess.check_output("mkdir /data/repos", shell=True)
  if not os.path.isdir("/data/repos/web"):
    subprocess.check_output("mkdir /data/repos/web", shell=True)
  if not os.path.isdir("/data/repos/server"):
    subprocess.check_output("mkdir /data/repos/server", shell=True)
  if not os.path.isdir("/data/repos/userpic"):
    subprocess.check_output("mkdir /data/repos/userpic", shell=True)

#mkdir
  subprocess.check_output("cp -r /var/www/SimPL/SimPL/init/web/* /data/repos/web/.", shell=True)
  subprocess.check_output("cp -r /var/www/SimPL/SimPL/init/server/* /data/repos/server/.", shell=True)
#copyfile
  subprocess.check_output("chown SimPL.SimPL /data/repos/ -R", shell=True)
#change owner
  subprocess.check_output("mysql --user=simpl --password=1111 simpl < /var/www/SimPL/SimPL/init/simpl_init.sql", shell=True)
#db init
  db=pymysql.connect(host='localhost', user='simpl', password='1111', db='simpl', charset='utf8')
  cur = db.cursor()
  cur.execute("TRUNCATE TABLE simpl.vcms_env")
  if cur.execute("select * from vcms_env where var_key='ex_username'")== 0:
    cur.execute("insert into vcms_env(var_key, var_value) values(%s, %s)", ('ex_username', username))
  else:
    cur.execute("update vcms_env set var_value=%s where var_key='ex_username'",(username))
  if cur.execute("select * from vcms_env where var_key='pumat_key'")== 0:
    cur.execute("insert into vcms_env(var_key, var_value) values(%s, %s)", ('pumat_key', key))
  else:
    cur.execute("update vcms_env set var_value=%s where var_key='pumat_key'",(key))
  if cur.execute("select * from vcms_env where var_key='pumat_address'")== 0:
    cur.execute("insert into vcms_env(var_key, var_value) values(%s, %s)", ('pumat_address', remocon_url))
  else:
    cur.execute("update vcms_env set var_value=%s where var_key='pumat_address'",(remocon_url))

  db.commit()
  db.close()
#DB
  subprocess.check_output("cd /var/www/SimPL;php artisan config:clear;", shell=True)
register(user, remocon_url)

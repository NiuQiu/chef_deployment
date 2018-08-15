# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
package "postgresql"


cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end

execute 'ntp_restart' do
  command 'service ntp restart'
end

execute 'postgresql_create' do
  command 'echo "CREATE USER semi with PASSWORD \'admin\'; CREATE DATABASE cmpt470; GRANT ALL PRIVILEGES ON DATABASE cmpt470 TO semi;" | sudo -u postgres psql'
  ignore_failure true
end

execute 'postgresql_table' do
  command 'psql -h localhost -d cmpt470 -U semi -a -w -f /vagrant/DB/createTable.txt'
  environment(
  	'PGPASSWORD' => 'admin'
  )
  ignore_failure false

end

# insert data
execute 'postgresql_insert' do
  command 'psql -h localhost -d cmpt470 -U semi -a -w -f /vagrant/DB/mockData.txt'
  environment(
  	'PGPASSWORD' => 'admin'
  )
  ignore_failure false

end
# execute 'postgresql_create' do
  # command 'echo "INSERT INTO orders(customer, drink) values(\'Peter\', \'coffee\');
			# INSERT INTO orders(customer, drink) values(\'Andrew\', \'water\');
			# INSERT INTO orders(customer, drink) values(\'Bill\', \'tea\');
			# INSERT INTO orders(customer, drink) values(\'Avery\', \'milk\');" | sudo -u postgres psql'

  # ignore_failure false
# end

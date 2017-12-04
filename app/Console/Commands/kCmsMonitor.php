<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\JobModel;
use App\kCmsEnvModel;

class kCmsMonitor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kCms:Monitor';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
		$m = CmsEnvModel::get();
		$env = Array();
		foreach($m as $record){
			$env[$record->var_key] = $record->var_value;
		}
		while(True){
			$jobs = JobModel::whereNotNull('qinfo')-> // Jobs with qinfo are monitorable
						  where("status","Running")->
						  get(['id','jobid','qinfo','pluginNext','output']);
			foreach($jobs as $job){
				if(isset($jobs->qinfo)){
					$qjobs = json_decode($jobs->qinfo);
					if(isset($qjobs)){
						$allJobsFinished = true;
							foreach($qjobs as $qjob){
							if(isset($output)) unset($output);
							exec($env['qstat']." ".$qjob->qid,$output);
							if($output[0]!=""){
								$allJobsFinished = false;
							}
						}
					}
				}
				if($allJobsFinished){ // Running
					$job->update(["status","finished"]);
/*				pluginNext should be remove, call chains should be defined in plugin 
					if( has PluginNext ){
						callPlugin(pluginNext, job->output);
					}else{
					}
*/
				}else{
// Log 
				}
			}
		}
    }
}

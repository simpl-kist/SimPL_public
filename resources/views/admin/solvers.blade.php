@extends('admin.layout')
@section('content')
<div class="container">
	<h3 style="margin:30px 0;">Solvers</h3>
	<div class="row">
		<div class="col-md-12">
			<table class="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Path</th>
						<th>Exec command</th>
						<th>Version</th>
						<th>Author</th>
						<th>Registered</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
@forelse($solvers as $solver)
					<tr class="solver-row" data-idx="{{$solver['id']}}">
						<td>{{$solver["id"]}}</td>
@can('update',$solver)
						<td><input class="form-control solver_name" style="width:100%;" value="{{$solver["name"]}}"></td>
						<td><input class="form-control solver_path" style="width:100%;" value="{{$solver["path"]}}"></td>
						<td><input class="form-control solver_exec" style="width:100%;" value="{{$solver["execcmd"]}}"></td>
						<td><input class="form-control solver_version" style="width:100%;" value="{{$solver["version"]}}"></td>
						<td><input class="form-control solver_author" style="width:100%;" value="{{$solver["author"]}}"></td>
@else
						<td>{{$solver["name"]}}</td>
						<td>{{$solver["path"]}}</td>
						<td>{{$solver["execcmd"]}}</td>
						<td>{{$solver["version"]}}</td>
						<td>{{$solver["author"]}}</td>
@endcan
						<td>{{$solver["updated_at"]}}</td>
						<td width=90px style="vertical-align:middle;">
@can('update',$solver)
							<button class="btn btn-sm btn-outline-primary" onclick="saveSolver({{$solver['id']}})">
								<i class="fas fa-pencil-alt"></i>
							</button>
@endcan
@can('delete',$solver)
							<button class="btn btn-sm btn-outline-danger" onclick="deleteSolver({{$solver['id']}})">
								<i class="fas fa-minus-circle"></i>
							</button>
@endcan
						</td>
					</tr>
@empty
					<tr>
						<td colspan=8 style="text-align:center;">No solver</td>
					</tr>
@endforelse
				</tbody>
				<tfoot>
					<tr>
						<td colspan=8 style="text-align:center;">{{$solvers}}</td>
					</tr>
					<tr class="solver-row" data-idx=-1>
						<td>New</th>
						<td><input class="form-control solver_name" style="width:100%;"></th>
						<td><input class="form-control solver_path" style="width:100%;"></th>
						<td><input class="form-control solver_exec" style="width:100%;"></th>
						<td><input class="form-control solver_version" style="width:100%;"></th>
						<td><input class="form-control solver_author" style="width:100%;"></th>
						<td><button class="btn btn-outline-success" onclick="saveSolver(-1);">Add</button></th>
						<td></th>
					<tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>
<script>
function saveSolver(idx){
	var target = $(".solver-row[data-idx='"+idx+"']");
	var name = target.find(".solver_name").val();
	var path = target.find(".solver_path").val();
	var exec = target.find(".solver_exec").val();
	var version = target.find(".solver_version").val();
	var author = target.find(".solver_author").val();
	$.ajax({
		url:"/admin/solvers/save",
		type:"post",
		data:{
			"_token":"{{csrf_token()}}",
			"idx":idx,
			"name":name,
			"path":path,
			"exec":exec,
			"version":version,
			"author":author
		},
		success:function(ret){
			if(ret.status === "Success"){
				alert(ret.message);
				location.reload();
			}else{
				alert(ret.message);
			}
		}
	})
}
function deleteSolver(idx){
	$.ajax({
		url:"/admin/solvers/delete",
		type:"post",
		data:{
			"_token":"{{csrf_token()}}",
			"idx":idx,
		},
		success:function(ret){
			if(ret.status === "Success"){
				alert(ret.message);
				location.reload();
			}else{
				alert(ret.message);
			}
		}
	})

}
</script>
@endsection

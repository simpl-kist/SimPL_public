@extends('layouts.app')

@section('content')
@if (session('status'))
	<div class="alert alert-success" role="alert">
		{{ session('status') }}
	</div>
@endif

<form method="POST" action="{{ route('password.email') }}">
	@csrf
	<div class="form-group row">
		<label for="email" class="col-3 col-form-label text-right">{{ __('E-Mail Address') }}</label>

		<div class="col-6">
			<input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

			@error('email')
				<span class="invalid-feedback" role="alert">
					<strong>{{ $message }}</strong>
				</span>
			@enderror
		</div>
	</div>

	<div class="form-group row mb-0">
		<div class="col-6 offset-3" style="text-align:right;">
			<button type="submit" class="btn btn-simpl">
				{{ __('Send Password Reset Link') }}
			</button>
		</div>
	</div>
</form>
@endsection

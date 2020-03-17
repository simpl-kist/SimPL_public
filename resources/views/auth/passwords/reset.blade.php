@extends('layouts.app')

@section('content')
<form method="POST" action="{{ route('password.update') }}">
	@csrf
	<input type="hidden" name="token" value="{{ $token }}">
	<div class="form-group row">
		<label for="email" class="col-3 col-form-label text-right">{{ __('E-Mail Address') }}</label>
		<div class="col-6">
			<input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ $email ?? old('email') }}" required autocomplete="email" autofocus>

			@error('email')
				<span class="invalid-feedback" role="alert">
					<strong>{{ $message }}</strong>
				</span>
			@enderror
		</div>
	</div>

	<div class="form-group row">
		<label for="password" class="col-3 col-form-label text-right">{{ __('Password') }}</label>

		<div class="col-6">
			<input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

			@error('password')
				<span class="invalid-feedback" role="alert">
					<strong>{{ $message }}</strong>
				</span>
			@enderror
		</div>
	</div>

	<div class="form-group row">
		<label for="password-confirm" class="col-3 col-form-label text-right">{{ __('Confirm Password') }}</label>

		<div class="col-6">
			<input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
		</div>
	</div>

	<div class="form-group row mb-0">
		<div class="col-6 offset-3">
			<button type="submit" class="btn btn-primary">
				{{ __('Reset Password') }}
			</button>
		</div>
	</div>
</form>
@endsection

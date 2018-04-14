import React from 'react'
import PropTypes from 'prop-types'
import Uploader from '../../ui/components/uploader.jsx'

const FileList = ({title, files}) => {
	return (
		<div>
			<h2>{title}</h2>
			<ul>
				{files.map(file => {
					return (<FileItem file={file}/>)
				})}
			</ul>
		</div>
	)
}

const FileItem = ({file}) => {
	const {id, name, url, error, progress} = file;

	return (
		<li key={id}>
			<label>{name}</label>
			{progress && <progress value={progress} max="100">{progress}%</progress>}
			{!progress && !error && <img src={url} style={{maxWidth: `200px`}} />}
			{!progress && !!error && <p className="failure">{error}</p>}
		</li>
	)
}

const Uploads = ({uploads, actions}) => {
	const pendingFiles = uploads.files.filter(({progress}) => progress && progress < 100)
	const completedFiles = uploads.files.filter(({progress}) => !progress)

	return <div className="wrapper">
		<header className="box">
			<h1>Upload Images</h1>
		</header>
		<main className="box">
			{/* do not delete this uploader component */}
			<Uploader upload={actions.upload} />
			{/* do not delete this uploader component */}

			<FileList title="In Progress" files={pendingFiles} />
		</main>

		<aside className="box">
			<FileList title="Completed" files={completedFiles} />
		</aside>
	</div>
}

const statusPropType = PropTypes.shape({
	status: PropTypes.oneOf([`init`, `pending`, `success`, `failure`]).isRequired,
	message: PropTypes.string.isRequired,
})

Uploads.propTypes = {
	uploads: PropTypes.shape({
		files: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
			name: PropTypes.string.isRequired,
			progress: PropTypes.number,
			url: PropTypes.string,
			error: PropTypes.string,
		})).isRequired,
		update: statusPropType.isRequired,
		delete: statusPropType.isRequired,
		share: statusPropType.isRequired,
	}).isRequired,
	actions: PropTypes.object.isRequired,
}

export default Uploads
